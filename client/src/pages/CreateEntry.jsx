import { Button } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createEntry, handleLoading, updateOrdersInLocal, addnewEntryLocal, handleSnack } from '../store/orders'


const CreateOrder = () => {

    const pendingOrders = useSelector((state) => state.orders.orders.pendingOrders)

    const sellerOrders = pendingOrders.sellerOrders
    const buyerOrders = pendingOrders.buyerOrders


    const createOrderEntry = (newEntry) => {
        if (newEntry.order_type === "seller") {
            const entryIndex = buyerOrders.findIndex((entry) => {
                return entry.price === newEntry.price
            })

            if (entryIndex !== -1) {
                dispatch(handleLoading(true))
                dispatch(updateOrdersInLocal({ newEntry, entryIndex }))
                return dispatch(createEntry(newEntry))
            }

            else {
                const entryIndex = sellerOrders.findIndex((entry) => {
                    return entry.price === newEntry.price
                })

                if (entryIndex !== -1) {
                    dispatch(handleLoading(true))
                    dispatch(addnewEntryLocal({ newEntry, entryIndex }))
                    return dispatch(createEntry(newEntry))
                }
                else {
                    dispatch(handleLoading(true))
                    dispatch(createEntry(newEntry))
                }
            }
        }

        else if (newEntry.order_type === "buyer") {
            const entryIndex = sellerOrders.findIndex((entry) => {
                return entry.price === newEntry.price
            })

            if (entryIndex !== -1) {
                dispatch(handleLoading(true))
                dispatch(addnewEntryLocal({ newEntry, entryIndex }))
                return dispatch(createEntry(newEntry))
            }
            else {
                const entryIndex = buyerOrders.findIndex((entry) => {
                    return entry.price === newEntry.price
                })

                if (entryIndex !== -1) {
                    dispatch(handleLoading(true))
                    dispatch(addnewEntryLocal({ newEntry, entryIndex }))
                    return dispatch(createEntry(newEntry))
                }
                else {
                    dispatch(handleLoading(true))
                    dispatch(createEntry(newEntry))
                }
            }
        }

        else {
            dispatch(handleSnack({
                open: true,
                severity: "error",
                message: "Invalid Entry"
            }))
        }

    }


    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            order_type: "",
            price: 0,
            quantity: 0
        },
        validationSchema: Yup.object({
            order_type: Yup.string().required('Please select user type'),
            price: Yup.number().min(1, 'minimum value can be 1').required('Field is required'),
            quantity: Yup.number().min(1, 'minimum value can be 1').required('Field is required')
        }),
        onSubmit: (vals) => {
            createOrderEntry(vals)
        }
    })


    return (
        <>
            <header>
                <h2>New Entry</h2>
            </header>
            <div className='createEntry'>
                <form onSubmit={formik.handleSubmit}>

                    <div className='inputField'>
                        <label htmlFor='price'>Price</label>
                        <input type="number"
                            name="price"
                            id="price"
                            value={formik.values.price}
                            {...formik.getFieldProps('price')} />
                        {formik.errors.price && formik.touched.price ? <span style={{ color: "firebrick" }}>{formik.errors.price}</span> : null}
                    </div>

                    <div className='inputField'>
                        <label htmlFor='quantity'>Quantity</label>
                        <input type="number"
                            name="quantity"
                            id="quantity"
                            value={formik.values.quantity}
                            {...formik.getFieldProps('quantity')} />
                        {formik.errors.quantity && formik.touched.quantity ? <span style={{ color: "firebrick" }}>{formik.errors.quantity}</span> : null}
                    </div>




                    <div id="order_type">
                        <label htmlFor="order_type">User Type</label>
                        <div id="radios">
                            <label htmlFor='seller'>Seller</label>
                            <input type='radio'
                                value="seller"
                                id="seller"
                                name="order_type"
                                onChange={formik.handleChange}
                            />


                            <label htmlFor='buyer'>Buyer</label>
                            <input type='radio'
                                value="buyer"
                                id="buyer"
                                name="order_type"
                                onChange={formik.handleChange} />
                        </div>
                        {formik.errors.order_type && formik.touched.order_type ? <span style={{ color: "firebrick" }}>{formik.errors.order_type}</span> : null}
                    </div>

                    <Button type='submit' variant='contained' style = {{
                        marginTop:"20px",
                        width:"100%"
                    }}>Create</Button>
                </form>
            </div>
        </>
    )
}

export default CreateOrder