import productsModel from '../dao/models/products.model.js';
import userModel from '../dao/models/users.model.js';
import {findProducts,findCarts,findAllUsers} from '../dao/mongo/views.mongo.js';
import { cartDB } from '../dao/factory.js';
import usersDTO from '../dto/users.dto.js';
import log from '../config/customLogger.js';
import fs from 'fs/promises';
import __dirname from '../utils.js';
import path from 'path';


const index = (req,res)=>{
    res.render('index')
}

const home = async (req, res) => {
    try {
        let products = await findProducts();
        res.render('home', { products, style: 'index.css'});
    } catch (error) {
        log.error('Internal server error.')
        res.sendServerError()
    }
}

const chat = (req,res)=>{
    res.render('chat')
}

const realTimeProducts = async (req, res) => {
    try {
        res.render('realTimeProducts', {style: 'index.css'});
    } catch (error) {
        log.error('Internal server error.')
        res.sendServerError()
    }
}

const cart = async (req, res) => {
    try {
        const {cart} = req.user.userData;
        let result = await cartDB.findCartById(cart.toString());
        res.render('cart', {result});
    } catch (error) {
        log.error('Internal server error.')
        res.sendServerError()
    }
}

const products = async (req,res)=>{
    try {
    const {firstname, lastname, email, age, cart, role} = req.user.userData;
    let isAdmin = (role == 'admin');
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    let sort = req.query.sort;
    let category = req.query.category;
    let query = {};
    let options = {page, limit, lean:true, sort:{} };
    if (category && category !== 'undefined') {
        query.category = category;
    }
    if (sort === 'asc') {
    options.sort.price = 1;
    } else if (sort === 'desc') {
    options.sort.price = -1;
    }

    let result = await productsModel.paginate(query, options);

    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&category=${category}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&category=${category}` : '';
    result.isValid= !(page<=0||page>result.totalPages)
    result.firstname = firstname;
    result.lastname = lastname;
    result.email = email;
    result.age = age;
    result.cart = cart;
    result.isAdmin = isAdmin
    res.render('products',result)
    }  
    catch (error) {
        log.error('Internal server error.')
        res.sendServerError()
    }
}

const users = async (req,res)=>{
    try {
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    let role = req.query.role;
    let query = {};
    let options = {page, limit, lean:true, sort:{} };
    if (role && role !== 'undefined') {
        query.role = role;
    }
 

    let result = await userModel.paginate(query, options);

    result.prevLink = result.hasPrevPage ? `http://localhost:8080/users?page=${result.prevPage}&limit=${limit}&category=${role}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/users?page=${result.nextPage}&limit=${limit}&category=${role}` : '';
    result.isValid= !(page<=0||page>result.totalPages)
    res.render('users',result)
    }  
    catch (error) {
        log.error('Internal server error.')
        res.sendServerError()
    }
}

const getLogs = async (req, res) => {
     try {
        const filePath = path.join(__dirname, '../logs/errors.log');
        let logs = await fs.readFile(filePath, 'utf-8');
        if (logs){
            return res.sendSuccess(logs);  
        }
     } catch (error) {
        //log.error('Internal server error.');
        res.sendServerError()
     }
}





export {
    index,
    home,
    chat,
    realTimeProducts,
    cart,
    products,
    getLogs,
    users
}