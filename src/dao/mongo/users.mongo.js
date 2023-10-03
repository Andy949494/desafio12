import userModel from '../models/users.model.js';
import MongooseSingleton from '../../config/db.connection.js';

class usersDaoMongo {
    constructor() {
        const db = MongooseSingleton.getInstance();
    }

    getUserByEmail = async function (email){
    try{
        const user = await userModel.findOne({email: email});
        if (!user) {
            throw Error("No se ha encontrado un usuario con ese email.");
        }else{
            return user;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    findAllUsers = async function (){
    try{
        const users = await userModel.find();    
        if (!users) {
            throw Error("No se han encontrado productos.");
        }else{
            return users;
        }
    } catch{
        throw Error("Error del servidor");
    }
}
    getUserById = async function (uid){
    try{
        const user = await userModel.findById(uid);
        if (!user) {
            throw Error("No se ha encontrado un usuario con esa Id.");
        }else{
            return user;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    updateUserDocuments = async function ({uid},user){
    try{
        const updatedUser = await userModel.updateOne({_id:uid},user);
        if (!updatedUser) {
            throw Error("Error al actualizar al usuario.");
        }else{
            return updatedUser;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    updateLastConnection = async function ({uid}){
    try{
        const argentineDate = new Date(Date.now() - 3 * 60 * 60 * 1000);
        const updatedUser = await userModel.findByIdAndUpdate({_id: uid}, { $set: { last_connection: argentineDate } });
        if (!updatedUser) {
            throw Error("Error al actualizar última conexión.");
        }else{
            return updatedUser;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    updateUserCart = async function ({userId},{cid}){
    try{
        const updatedUser = await userModel.findByIdAndUpdate({_id: userId}, { $set: { cart: cid } });
        if (!updatedUser) {
            throw Error("Error al actualizar última conexión.");
        }else{
            return updatedUser;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    updatePasswordByEmail = async function (email, hashedPassword){
    try{
        const user = await userModel.updateOne({email: email}, {$set: {password: hashedPassword}});
        if (!user) {
            throw Error("No se ha podido actualizar la contraseña.");
        }else{
            return user;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    updateUserRole = async function ({uid},newRole){
    try{
        const updatedUser = await userModel.updateOne({_id:uid},{role:newRole});
        if (!updatedUser) {
            throw Error("No se ha encontrado un usuario con esa Id.");
        }else{
            return updatedUser;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    emailsFromUsersToDelete = async function (){
    try{
        const argentineDate = new Date(Date.now() - 3 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(argentineDate);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const usersMails = await userModel.find({last_connection: { $lt: twoDaysAgo },},{"email":1,"_id":0});
        if (!usersMails) {
            throw Error("Error al eliminar usuarios.");
        }else{
            return usersMails;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    deleteUsersByDate = async function (){
    try{
        const argentineDate = new Date(Date.now() - 3 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(argentineDate);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        const deletedUsers = await userModel.deleteMany({last_connection: { $lt: twoDaysAgo },});
        if (!deletedUsers) {
            throw Error("Error al eliminar usuarios.");
        }else{
            return deletedUsers;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    deleteUser = async function ({uid}){
    try{
        const deletedUser = await userModel.deleteOne({_id:uid});
        if (!deletedUser) {
            throw Error("Error al eliminar usuario.");
        }else{
            return deletedUser;
        }
    } catch{
        throw Error("Error del servidor");
    }
}
}
export default usersDaoMongo