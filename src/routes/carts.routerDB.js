import Routers from "./router.js";
import {addNewCart, addProductToCart, deleteAllProductsFromCart, deleteOneProductFromCart, getCartById, getCarts, updateCart, updateProductQuantity, purchase} from "../controllers/carts.controller.js"

export default class ProductsRouter extends Routers{
    init(){
        this.post('/', ["USER","ADMIN","PREMIUM"], addNewCart);

        this.get('/', ["USER","ADMIN","PREMIUM"], getCarts);

        this.get('/:cid', ["USER","ADMIN","PREMIUM"], getCartById);

        this.post('/:cid/product/:pid', ["USER","ADMIN","PREMIUM"], addProductToCart);

        this.put('/:cid', ["USER","ADMIN","PREMIUM"], updateCart);

        this.put('/:cid/product/:pid', ["USER","ADMIN","PREMIUM"], updateProductQuantity);

        this.delete('/:cid/product/:pid', ["USER","ADMIN","PREMIUM"], deleteOneProductFromCart);

        this.delete('/:cid', ["USER","ADMIN","PREMIUM"], deleteAllProductsFromCart);

        this.post('/:cid/purchase', ["USER","ADMIN","PREMIUM"], purchase);

    }
}