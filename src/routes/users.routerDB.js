import Routers from "./router.js";
import passport from 'passport';
import __dirname from '../utils.js';
import {login,renderLogin,logout,renderRecovery,passwordRecover,recoverPassword,resetPassword,changeRole,uploadDocuments, getAllUsers, deleteInactiveUsers, deleteUsers} from "../controllers/users.controller.js"
import { isUserOrTokenValid } from "../middlewares/user.middlewares.js";
import { uploader } from "../utils.js";

export default class UsersRouter extends Routers{
    init(){

        this.post('/passwordRecover',["PUBLIC"], passwordRecover);

        this.get('/recoverPassword',["PUBLIC"], recoverPassword);

        this.post('/resetPassword',["PUBLIC"], isUserOrTokenValid ,resetPassword);

        this.get('/recovery', ["PUBLIC"], renderRecovery)

        this.get('/',["PUBLIC"], getAllUsers);

        this.post('/register',["PUBLIC"], passport.authenticate('register', {successRedirect: '/api/users/login', failureRedirect: '/', failureFlash: true}))

        this.get('/login', ["PUBLIC"], renderLogin);

        this.post('/login', ["PUBLIC"], passport.authenticate('login'), login)

        this.post('/:uid/documents', ["USER","ADMIN","PREMIUM"], uploader.array('documents'), uploadDocuments);

        this.get('/logout', ["USER","ADMIN","PREMIUM"], logout);

        this.post('/premium/:uid', ["ADMIN"], changeRole)

        this.delete('/',["ADMIN"], deleteInactiveUsers);

        this.delete('/:uid',["ADMIN"], deleteUsers);

    }
}