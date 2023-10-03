import jwt from 'jsonwebtoken';
import config from '../config/config.js'
import { userDB } from '../dao/factory.js'
import usersDTO from '../dto/users.dto.js';
import { sendRecoverPassword, sendDeletedUser} from '../utils/mail.utils.js';
import { generarToken, validateToken, createHash } from '../utils/validations.utils.js';
import log from '../config/customLogger.js';
import __dirname from '../utils.js';

const privateKey = config.privateKey

const renderLogin = (req, res) => {
    res.render('login')
}

const login = async (req, res) => {
    const {_id, firstname, lastname, email, age, cart, role, documents,last_connection} = req.user;
    let userData = new usersDTO({_id,firstname, lastname, email, age, cart, role, documents,last_connection})
    try {
        const token = jwt.sign({userData}, privateKey, { expiresIn: '1h' });
        res.cookie('cookieToken', token, { maxAge: 3600000, httpOnly: true });
        let uid = _id.toString()
        const last_connection = await userDB.updateLastConnection({uid});
        if (!last_connection) {
            return res.sendUserError("Error trying to update last connection.")
        }
        res.redirect('/products');
    } catch (error){
        log.error('Internal server error.')
        res.sendServerError()
    }
}

const logout = async (req, res) => {
    try {
        let uid = req.user.userData._id.toString()
        const last_connection = await userDB.updateLastConnection({uid});
        if (!last_connection) {
            return res.sendUserError("Error trying to update last connection.")
        }
        req.session.destroy();
        res.clearCookie('cookieToken').redirect('/api/users/login');
    } catch (error){
        log.error('Internal server error.')
        res.sendServerError()
    }
}

const getAllUsers = async (req, res) => {
    try {
        let users = await userDB.findAllUsers();
        if (users){
            const mappedUsers = users.map(user => new usersDTO(user));
            return res.sendSuccess(mappedUsers);  
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}



const uploadDocuments = async (req, res) => {
    try {
        let uid = req.params.uid;
        if (!uid){
            res.sendUserError('No user ID provided')
        }  
        let user = await userDB.getUserById(uid)
        if (!user) {
            return res.sendUserError('Id not found.')
        } else {

        if (!req.files || req.files.length === 0) {
            return res.sendUserError('No files uploaded.');
        }
        if (req.files.length > 0) {
            let documentsLinks = req.files.map(file => `http://localhost:8080/documents/${file.filename}`); //la función flecha transforma cada elemento del arreglo req.files en una URL completa del documento y se almacena en el arreglo documents.
            let documentsNames = req.files.map(file => file.originalname);

            if (!user.documents[0]) {
                user.documents[0] = { name: [], reference: [] };
            }

            user.documents[0].name.push(...documentsNames);
            user.documents[0].reference.push(...documentsLinks);     
        }
        let result = await userDB.updateUserDocuments({uid},user);
        if(!result){
            return res.sendUserError('Error al actualizar documents.')
        }else{
            return res.sendSuccess(result);
        }
        }
    } catch (error){
        log.error('Internal server error.')
        res.sendServerError()
    }
}

const renderRecovery = (req, res) => {
    res.render('recovery')
}

const passwordRecover = async (req, res) => {
    const { email } = req.body;

    if(!email) {
        return res.status(404).send("email no enviado");
    }

    try {
        const user = await userDB.getUserByEmail(email);

        if(!user) {
            return res.status(404).send("Usuario no existente!");
        }

        const token = generarToken(email);
        sendRecoverPassword(email, token);
        res.status(200).send("Reseto de contraseña enviada!");
    } catch (e) {
        console.log("Error: ", e);
        res.status(500).send("Error interno!");
    }
}

const recoverPassword = (req, res) => {
    const { token } = req.query;
    const { email } = req.body;
    try {
        const checkToken = validateToken(token);
        if(!checkToken) {
            console.log("Invalid token");
            return res.status(401).send("Acceso denegado!");
        }

        const newToken = generarToken(email);
        
        res.status(200).send(`Enviar a la pagina para resetar la contraseña!, token: ${newToken}`);

    } catch (e) {
        console.log("Error: ", e);
        res.status(500).send("Error interno!");
    }

}

const resetPassword = async (req, res) => {
    const { email, password} = req.body;

    try {
        const hashedPassword = createHash(password);
        await userDB.updatePasswordByEmail(email, hashedPassword);

        res.status(200).send("Contraseña modificada correctamente");
    } catch (e) {
        console.log("Error: ", e);
        res.status(500).send("Error interno!");
    }
    
}

const changeRole = async (req, res) => {
    try {
        const uid = req.params.uid;
        if (!uid){
            return res.sendUserError('No user Id provided')
        }
        let user = await userDB.getUserById(uid)
        if (!user) {
            return res.sendUserError('Id not found.')
        } 
        if (user.role == 'user'){
            if (user.documents == "" || user.documents < 3){
                res.sendUserError('No ha terminado de cargar toda la documentación necesaria.')
            } else if (user.documents[0].name.length === 3){
                let newRole = 'premium';
                let roleChange = userDB.updateUserRole({uid},newRole)
                if(!roleChange){
                    return res.sendUserError('Error al actualizar el rol del usuario.')
                } else{
                    return res.sendSuccess("Su nuevo rol es Premium");
                }
            }
        } else if (user.role == 'premium'){
            let newRole = 'user';
            let roleChange = userDB.updateUserRole({uid},newRole)
            if(!roleChange){
                return res.sendUserError('Error al actualizar el rol del usuario.')
            } else{
                return res.sendSuccess("Su nuevo rol es User");
            }
        } else {
            return res.sendUserError('No puede actualizar usuarios que no sean user o premium.')
        }
    } catch (error) {
       log.error('Internal server error.');
       res.sendServerError()
    }
}

const deleteInactiveUsers = async (req, res) => {
    try {
        let usersEmails = await userDB.emailsFromUsersToDelete();
        if(usersEmails.length == 0){
            return res.sendUserError('No hay usuarios con última conexión anterior a los últimos dos días.')
        }
        usersEmails.forEach(element => {
            sendDeletedUser(element.email)
        });
        let deletedUsers = await userDB.deleteUsersByDate();
        if (!deletedUsers){
            return res.sendUserError('Error al eliminar los usuarios.')
        } else {
            return res.sendSuccess(`Usuarios eliminados: ${usersEmails}`);  
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}

const deleteUsers = async (req, res) => {
    try {
        const uid = req.params.uid;
        if (!uid){
            return res.sendUserError('No user Id provided')
        }
        let user = await userDB.getUserById(uid)
        if (!user) {
            return res.sendUserError('Id not found.')
        } 
        const deletedUser = await userDB.deleteUser({uid});
        if (!deletedUser){
            return res.sendUserError('Error trying to delete user.')
        } else{
            return res.sendSuccess('User deleted successfully');
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}

export {
    login,
    renderLogin,
    logout,
    uploadDocuments,
    renderRecovery,
    changeRole,
    recoverPassword,
    resetPassword,
    passwordRecover,
    getAllUsers,
    deleteInactiveUsers,
    deleteUsers
}