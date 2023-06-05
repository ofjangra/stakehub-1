import { Routes, Route } from "react-router"
import CompletedOrders from "./pages/CompletedOrder"
import PendingOrders from "./pages/PendingOrder"
import CreateOrder from "./pages/CreateEntry"
import Chart from './pages/Chart'
const RouteLayout = () =>{
    return(
        <Routes>
            <Route path="/" element = {<PendingOrders/>}/>
            <Route path = "/completed" element = {<CompletedOrders/>}/>
            <Route path = "/create" element = {<CreateOrder/>}/>
            <Route path="/chart" element = {<Chart/>}/>
        </Routes>
    )
}

export default RouteLayout