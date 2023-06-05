import mongoose from 'mongoose'
import logger from '../logger/logger.index.js'
import { Order, CompletedOrder } from '../models/order.model.js'

export const createOrder = async (req, res) => {
    const {order_type, price, quantity} = req.body

    if(!order_type || !price || !quantity) {
        return res.status(422).json({
            success:false,
            messgae:"please provide required data"
        })
    }

    try {
        const orderExists = await Order.findOne({ price: price, order_type: order_type })

        let newCompletedOrder;

        if (orderExists) {

            await Order.updateOne({ _id: orderExists._id }, {
                order_type: orderExists.order_type,
                price: price,
                quantity: orderExists.quantity + quantity
            }, { new: true })

            logger.info(`new entry added`)

            return res.status(201).json({
                success:true,
                message: "entry created successfully",
            })
        }


        const matchedOrder = await Order.findOne({
            price: price,
            order_type: order_type === "buyer" ? "seller" : "buyer"
        })


        if (matchedOrder) {
            const session = await mongoose.startSession();
            session.startTransaction()

            switch (true) {

                // if the seller quantity is equal to buyer quantity 
                // order is removed form pending order collection and inserted into 
                // completed order collection

                case (matchedOrder.quantity === quantity):

                    await Order.deleteOne({ _id: matchedOrder._id }).session(session)

                     newCompletedOrder = await CompletedOrder.create([{
                        price: price,
                        quantity: quantity
                    }], { session: session })

                    await session.commitTransaction()

                    await session.endSession()

                    logger.info(`order matched for price : ${price} ${quantity}`)

                    return res.status(200).json({
                        success:true,
                        message: 'order matched',
                        completed_order_entry:newCompletedOrder
                    })


                // if the quantity in new order is greater or lesser than the matched order
                // the quantity of matched order is updated with value
                // obtained by subtracting lesser quantity from greater quantity 


                case (matchedOrder.quantity < quantity):


                        await Order.updateOne({ _id: matchedOrder._id }, {
                        order_type:order_type,
                        price: price,
                        quantity: (quantity - matchedOrder.quantity)
                    }, { new: true}).session(session)

                        newCompletedOrder =  await CompletedOrder.create([{
                        price: price,
                        quantity: matchedOrder.quantity
                    }], {session:session})

                    await session.commitTransaction()

                    await session.endSession()

                    logger.info(`order matched for price: ${price}, ${matchedOrder.price} & qty:${quantity}, ${matchedOrder.quantity}`)

                    return res.status(200).json({
                        success: true,
                        message: "order matched",
                        completed_order_entry:newCompletedOrder
                    })

                case (matchedOrder.quantity > quantity):

                    await Order.updateOne({_id: matchedOrder._id }, {
                        order_type: matchedOrder.order_type,
                        price: price,
                        quantity: matchedOrder.quantity - quantity
                    }, { new: true }).session(session)

                    newCompletedOrder =  await CompletedOrder.create([{
                        price: price,
                        quantity: quantity
                    }], { session: session })

                    await session.commitTransaction()

                    await session.endSession()

                    logger.info(`order matched for price: ${price}, ${matchedOrder.price} & qty:${quantity}, ${matchedOrder.quantity}`)

                    return res.status(200).json({
                        success: true,
                        message: "order matched",
                        completed_order_entry:newCompletedOrder
                    })

            }

        }

        if (!matchedOrder) {
            const newEntry = await Order.create([{
                order_type:order_type,
                price:price,
                quantity:quantity
            }])

            logger.info(`order created for price: ${price} & qty:${quantity}`)

            return res.status(201).json({
                success:true,
                message:"order created",
                new_entry: newEntry
            })
        }
    } catch (err) {
        logger.error(`order creation error : ${err}`)
        return res.status(409).json({
            success: false,
            message: "something went wrong"
        })
    }
}



export const getOrders = async (req, res) =>{
    const session = await mongoose.startSession()
    try {   

            session.startTransaction()
    

            const pendingOrders = await Order.find().select("price quantity order_type").sort("-createdAt")
       
            const completedOrders = await CompletedOrder.find().sort("-createdAt")

            session.commitTransaction()
            session.endSession()

            if (pendingOrders.length <= 0 && completedOrders.length <= 0) {
                return res.status(404).json({
                    success:false,
                    message:"no more results"
                })
            }
    
            return res.status(200).json({
                success:true,
                orders:{
                    pending_orders:pendingOrders,
                    completed_orders:completedOrders
                },
            })
       
    } catch (err) {
        logger.error(`order fetch error: ${err}`)
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            orders:{
                pending_orders:[],
                completed_orders:[]
            }
        })
    }
}


