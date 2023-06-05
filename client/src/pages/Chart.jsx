import io  from 'socket.io-client'
import { useEffect, useState } from 'react'
import ChartTable from '../components/ChartTable'
import Preload from '../components/Preload'

const Chart = () =>{
    const socket = io.connect("http://localhost:5000")

    const [ordersData, setOrdersData] = useState([])

    useEffect(() =>{
        socket.on("data", (data) =>{
            setOrdersData(data)
        })
    },[])

    return(
        <>
        {
            ordersData.length === 0 ? 
            <Preload/> :   
            <ChartTable ordersData={ordersData}/>
        }
        </>
    )

}

export default Chart