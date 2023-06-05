import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateOrdersInLocal, getOrders } from "../store/orders"


const PendingOrderTable = () => {
    const ordersState = useSelector((state) => state.orders.orders)

    const [orders, setOrders] = useState([])

    useEffect(() => {
        const buyerOrders = ordersState.pendingOrders.buyerOrders

        const sellerOrders = ordersState.pendingOrders.sellerOrders
        const allOrders = buyerOrders.length > sellerOrders.length ?

            buyerOrders.map((buyerOrder, index) => {
                return {
                    buyer: buyerOrder,
                    seller: sellerOrders[index]
                }
            }) : sellerOrders.map((sellerOrder, index) => {
                return {
                    seller: sellerOrder,
                    buyer: buyerOrders[index]
                }
            });

        setOrders(allOrders)

    }, [ordersState])





   

    return (
        <>
            <header>
                <h2>Pending Orders</h2>
            </header>
            <div className="container" >
                <div className="dataTable">
                    <section className="buyerData" style={{
                        width: "100%"
                    }}>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ color: "green" }}>Buyer Quantity</th>
                                    <th style={{ color: "green" }}>Buyer Price</th>
                                    <th style={{ color: "firebrick" }}>Seller Price</th>
                                    <th style={{ color: "firebrick" }}>Seller Quantity</th>
                                </tr>

                            </thead>
                            <tbody>
                                {
                                    orders.map((order, i) => {
                                        return (
                                            <tr key={i}>
                                                <td style={{ color: "green" }}>{order?.buyer?.quantity}</td>
                                                <td style={{ color: "green" }}>{order?.buyer?.price}</td>
                                                <td style={{ color: "firebrick" }}>{order?.seller?.price}</td>
                                                <td style={{ color: "firebrick" }}>{order?.seller?.quantity}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </section>
                </div>

            </div>
        </>
    )
}

export default PendingOrderTable