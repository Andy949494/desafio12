import {productDB, cartDB, userDB} from '../dao/factory.js';
import log from '../config/customLogger.js';

const addNewCart = async (req, res) => {
    try {
        let newCart = await cartDB.createCart();

        if (!newCart) {
            res.sendUserError('Error trying to create a new cart');
        } else {
            return res.sendSuccess(newCart);
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError();
    }
}

const addNewCartToUser = async (req, res, userId) => {
    try {
        let newCart = await cartDB.createCart();

        if (!newCart) {
            res.sendUserError('Error trying to create a new cart');
        } else {
            let cid = newCart._id.toString()
            const updated_user_cart_id = await userDB.updateUserCart({userId}, {cid});
            
            if (!updated_user_cart_id) {
                return res.sendUserError("Error trying to update user cart Id.");
            }
            
            return res.sendSuccess(newCart);
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError();
    }
}

const getCarts = async (req, res) => {
    try {
        let allCarts = await cartDB.findAllCarts();
        if (!allCarts) {
            res.sendUserError('Error trying to get all carts.')
        } else {
            let limit = req.query.limit;
            if (limit){
                let LimitedProducts = allCarts.slice(0,limit);
                return res.sendSuccess(LimitedProducts);
            } else {
                return res.sendSuccess(allCarts);  
            }
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}

const getCartById = async (req, res) => {
    try {
        let cid = req.params.cid
        if (!cid){
            res.sendUserError('No cart ID provided')
        }
        let cart = await cartDB.findCartById(cid)
        if (!cart) {
            res.sendUserError('Error trying to find cart by ID')
        } else {
            return res.sendSuccess(cart);  
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}

const addProductToCart = async (req, res) => {
    try {
        let cid = req.params.cid;
        if (!cid){
            res.sendUserError('No cart ID provided')
        }
        let pid = req.params.pid;
        if (!pid){
            res.sendUserError('No product ID provided')
        }
        let product = await productDB.findProductById(pid)
        let cart = await cartDB.findCartById(cid)
        if (product.owner == req.user.userData.email){
             return res.sendUserError('No puede agregar un producto que le pertenece.')
        }
        if (product && cart) {
            const productIndex = cart.products.findIndex((e) => e.product._id == (pid));
        if (productIndex !== -1) {
                return res.sendUserError('Ya posee ese producto en el carrito')
            // cart.products[productIndex].quantity += 1;
            // let updatedCart = await cartDB.updateOneCart({cid},cart);
            // if(!updatedCart){
            //     res.sendUserError('Error trying to add product to cart')
            // } else{
            //     return res.sendSuccess(updatedCart);
            // }
        } else {
            cart.products.push({ product: (pid), quantity: 1 });
            let updatedCart = await cartDB.updateOneCart({cid},cart);
            if(!updatedCart){
                res.sendServerError('Error trying to add product to cart')
            } else{
                return res.sendSuccess('Product added successfully');
            }
        }
    } else if (!product){
        res.sendUserError('Error trying to find product by ID')
        } else if (!cart){
            res.sendUserError('Error trying to find cart by ID')
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}

const updateCart = async (req, res) => {
    try {
        let cart = await cartDB.findCartById(req.params.cid)
        if (!cart) {
            res.sendUserError('Error trying to find cart by ID')
        } else {
        let cid = req.params.cid;
        if (!cid){
            res.sendUserError('No cart ID provided')
        }    
        let product = req.body;
        if (!product){
            res.sendUserError('Nothing found in the body')
        }  
        cart.products = product;
        let updatedCart = await cartDB.updateOneCart({cid},cart);
        if(!updatedCart){
            res.sendUserError('Error trying to update cart')
        } else{
            return res.sendSuccess('Cart updated successfully');
        }
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}

const updateProductQuantity = async (req, res) => {
    try {
        let cid = req.params.cid;
        if (!cid){
            res.sendUserError('No cart ID provided')
        }
        let pid = req.params.pid;
        if (!pid){
            res.sendUserError('No product ID provided')
        }
        let newQuantity = parseInt(req.body.quantity);
        if (!newQuantity){
            res.sendUserError('No quantity found in the body')
        }  
        let cart = await cartDB.findCartById(cid)
        if (!cart) {
            res.sendUserError('Error trying to find cart by ID')
        } else {
            const productIndex = cart.products.findIndex((e) => e.product._id == (pid));
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;
                let updatedCart = await cartDB.updateOneCart({cid},cart);
                if(!updatedCart){
                    res.sendUserError('Error trying to update product quantity')
                } else{
                    return res.sendSuccess('Quantity updated successfully');
                }
            }
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}

const deleteOneProductFromCart = async (req, res) => {
    try {
        let cid = req.params.cid;
        if (!cid){
            res.sendUserError('No cart ID provided')
        }
        let pid = req.params.pid;
        if (!pid){
            res.sendUserError('No product ID provided')
        }
        let cart = await cartDB.findCartById(cid)
        if (!cart){
            res.sendUserError('Error trying to find cart by ID')
        } else {
            const productIndex = cart.products.findIndex((e) => e.product._id == (pid));
            if (productIndex !== -1) {
                cart.products.splice(productIndex,1);
                let updatedCart = await cartDB.updateOneCart({cid},cart);
                if(!updatedCart){
                    res.sendUserError('Error trying to delete product from cart')
                } else{
                    return res.sendSuccess('Product deleted successfully');
                }
            }
        }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}

const deleteAllProductsFromCart = async (req, res) => {
    try {
        let cid = req.params.cid;
        if (!cid){
            res.sendUserError('No cart ID provided')
        }
        let cart = await cartDB.findCartById(cid)
        if (!cart){
            res.sendUserError('Error trying to find cart by ID')
        } else {
            cart.products.splice(0);
            let updatedCart = await cartDB.updateOneCart({cid},cart);
                if(!updatedCart){
                    res.sendUserError('Error trying to delete all products from cart')
                } else{
                    return res.sendSuccess('All products deleted successfully');
                }
            }
    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}

const purchase = async (req, res) => {
    try {
        let cid = req.params.cid
        if (!cid){
            res.sendUserError('No cart ID provided')
        }
        let cart = await cartDB.findCartById(cid)
        if (!cart) {
            res.sendUserError('Error trying to find cart')
            return;
        }

        let not_enough_stock = []
        let amount = 0;
        let successful_purchase = false;
        let purchaser = req.user.userData.email

        //Bucle while para actualizar stock, eliminar compras del carrito y mostrar compras no procesadas.
        let i = 0;
        while (i < cart.products.length) {
            let element = cart.products[i];
            let stock = element.product.stock;
            let quantity = element.quantity;

            if (quantity <= stock) {
                let pid = element.product._id.toString()
                let new_quantity = { stock: stock - quantity }
                amount += quantity * element.product.price
                successful_purchase = true

                let updated_stock = await productDB.updateOneProduct({ pid }, new_quantity);
                if (!updated_stock) {
                    res.sendUserError('Error trying to modify product stock')
                    return;
                }

                cart.products.splice(i, 1);
            } else if (quantity > stock) {
                not_enough_stock.push(element.product._id)
                i++;
            }
        }

        if (not_enough_stock.length > 0) {
            console.log(`Ids de productos no procesados: ${not_enough_stock}`);
        }

        let updatedCart = await cartDB.updateOneCart({ cid }, cart);
        if (!updatedCart) {
            res.sendUserError('Error trying to delete product from cart')
            return;
        }

        if (successful_purchase) {
            let newTicket = await cartDB.generateTicket(amount, purchaser);
            if (!newTicket) {
                res.sendUserError('Error trying to generate purchase ticket')
            } else {
                return res.sendSuccess(newTicket);
            }
        }

    } catch (error) {
        log.error('Internal server error.');
        res.sendServerError()
    }
}

export{
    addNewCart,
    addNewCartToUser,
    getCarts,
    getCartById,
    addProductToCart,
    updateCart,
    updateProductQuantity,
    deleteOneProductFromCart,
    deleteAllProductsFromCart,
    purchase 
}