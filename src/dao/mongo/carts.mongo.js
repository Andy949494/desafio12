import cartsModel from '../models/carts.model.js'
import ticketModel from '../models/ticket.model.js';
import { generateRandomString } from '../../utils.js';
import MongooseSingleton from '../../config/db.connection.js';

class cartsDaoMongo {
    constructor() {
        const db = MongooseSingleton.getInstance();
    }

    createCart = async function (){
    try{
        let carts = await cartsModel.create({});
        if (!carts) {
            throw Error("Error al agregar nuevo carrito.");
        }else{
            return carts;
        }
    } catch{
        throw Error("Error de servidor.");
    }
}

    findAllCarts = async function (){
    try{
        const carts = await cartsModel.find().populate('products.product');
        if (!carts) {
            throw Error("No se han encontrado productos.");
        }else{
            return carts;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    findCartById = async function (cid){
    try{
        const cart = await cartsModel.findById(cid).populate('products.product').lean();;
        if (!cart) {
            throw Error("No se ha encontrado un carrito con esa Id.");
        }else{
            return cart;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    updateOneCart = async function ({cid},cart){
    try{
        const updatedCart = await cartsModel.updateOne({_id:cid},cart);
        if (!updatedCart) {
            throw Error("Error al actualizar el carrito.");
        }else{
            return updatedCart;
        }
    } catch{
        throw Error("Error del servidor");
    }
}

    generateTicket = async function (amount,purchaser){
    try{
        let code = generateRandomString(6);
        const searchedCode = await ticketModel.find({code: code})
        while (code == searchedCode) {
            code = generateRandomString(6);
        }
        const purchase_datetime = new Date(Date.now() - 3 * 60 * 60 * 1000);

        let ticketData = {code,purchase_datetime,amount,purchaser}

        const ticket = await ticketModel.create(ticketData);
        if (!ticket) {
            throw Error("Error al generar nuevo ticket.");
        }else{
            return ticket;
        }
    } catch{
        throw Error("Error del servidor");
    }
}
}

export default cartsDaoMongo
