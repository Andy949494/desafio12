import Routers from "./router.js";
import {index, home, chat, realTimeProducts, cart, products, getLogs, users} from "../controllers/views.controller.js"

export default class ViewsRouter extends Routers{
    init(){

        this.get('/', ["PUBLIC"], index)

        this.get('/home', ["PUBLIC"], home);

        this.get('/chat', ["USER"], chat)

        this.get('/realtimeproducts', ["USER", "ADMIN", "PREMIUM"], realTimeProducts);

        this.get('/cart', ["USER", "ADMIN", "PREMIUM"], cart);

        this.get('/products', ["USER", "ADMIN", "PREMIUM"], products)

        this.get('/users', ["ADMIN"], users)

        this.get('/logerTest', ["PUBLIC"], getLogs)

    }
}