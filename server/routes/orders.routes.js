import { createOrder, getOrders } from '../controllers/order.controller.js'


export const ordersRouter = (app) => {

    
    app.post("/api/create_order", createOrder)

    app.get('/api/orders', getOrders)



}