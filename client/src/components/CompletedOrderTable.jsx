import { useSelector } from "react-redux"

const CompletedOrderTable = () =>{
    const completedOrder = useSelector((state) => state.orders.orders.completedOrders)
    return(
        <>
        <header>
            <h2>Completed Orders</h2>
        </header>
        <div className="container" >
            <div className="dataTable">
                <section className="buyerData" style = {{
                    width:"100%"
                }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Buyer Quantity</th>
                                <th>Buyer Price</th>
                            </tr>
                                
                        </thead>
                        <tbody>
                            {
                                completedOrder.map((order) =>{
                                    return(
                                        <tr key = {order._id}>
                                            <td>{order.price}</td>
                                            <td>{order.quantity}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </section>
                <div className="pagination">
            </div>
            </div>
            
            </div>
        </>
    )
}

export default CompletedOrderTable