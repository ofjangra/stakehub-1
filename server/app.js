import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import logger from './logger/logger.index.js'
import { ordersRouter } from './routes/orders.routes.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { CompletedOrder } from './models/order.model.js'

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config({
    path:"./config.env"
})


const app = express()

// app.use(cors())

app.use(bodyParser.json())

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors:{
        origin:"*",
        methods:["GET"]
    }
})

const fetchCompletedOrders = async () =>{
   const data =  await CompletedOrder.find().sort("createdAt")
   return data
}

io.on("connection", (socket) => {
    // to update the chart more frequently and make it more real-time,
    //  a caching system may need to be implemented
    // it helps in reducing database queries

    console.log(socket.id)
    setInterval(async () => {
        const data =  await fetchCompletedOrders()
        socket.emit("data", data)
    }, 5000)
})



const port  = process.env.PORT || 5000

const dbURI = process.env.DB_URI

if (typeof dbURI === "string") {
    mongoose.connect(dbURI)
}

mongoose.connection.on('error', (err) =>{
    logger.error(err)
})

mongoose.connection.on('connected', () =>{
    logger.info('database connected')
})

ordersRouter(app)

app.use(express.static("dist"))


app.get("/ping", (req, res) =>{
    res.status(200).json("pong pong")
})

app.get("*", (req,res)=>{
    return res.sendFile(path.resolve(__dirname, "dist", "index.html"))
})

httpServer.listen(port, () => {
    logger.info(`server started at port : ${port}`)
})
