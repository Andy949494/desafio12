import transporter from '../config/mails.js'
import config from '../config/config.js';


const sendRecoverPassword = (email, token) => {

    const url = config.baseUrl + config.recoverPassword + `?token=${token}`;
    const button = `<a href=${url} target="_blanl">
                        <button>Recuperar contraseña</button>
                    </a>`;
    const mailOptions = {
        from: 'noreply@miempresa.com',
        to: email,
        subject: 'Recuperacion de contraseña',
        html: `
            <h1>Por favor haga click en el siguiente boton para recuperar su contraseña</h1>
            <hr>
            ${button}
        `
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if( err ) {
            console.log("Error: ", err);
            return;
        }

        console.log("Mail enviado: ", info);
    });
}

const sendDeletedUser = (email) => {

    const mailOptions = {
        from: 'noreply@miempresa.com',
        to: email,
        subject: 'Usuario eliminado',
        html: `<h1>Su usuario ha sido eliminado del sistema por no haber establecido conexión en los últimos dos días.</h1><hr>`
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if( err ) {
            console.log("Error: ", err);
            return;
        }

        console.log("Mail enviado: ", info);
    });
}

const sendDeletedProduct = (email,product) => {

    const mailOptions = {
        from: 'noreply@miempresa.com',
        to: email,
        subject: 'Su producto ha sido eliminado',
        html: `<h1>Su producto ha sido eliminado: </h1>${product}`
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if( err ) {
            console.log("Error: ", err);
            return;
        }

        console.log("Mail enviado: ", info);
    });
}

export {
    sendRecoverPassword,
    sendDeletedUser,
    sendDeletedProduct
}