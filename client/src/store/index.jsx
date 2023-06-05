import orders from "./orders";
import { configureStore } from "@reduxjs/toolkit";


const store = configureStore({
    reducer:{
        orders
    }
})


export default store