import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


const getOrders = createAsyncThunk(
    'getOrders',
    async () => {
        const response = await fetch('/api/orders', {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            }
        })

        const jsonResponse = await response.json()


        return jsonResponse
    }
)

const createEntry = createAsyncThunk(
    'createEntry',

    async (body) => {
        const response = await fetch('/api/create_order', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const jsonResponse = await response.json()

        return jsonResponse
    }
)

const orders = createSlice({
    name: 'orders',
    initialState: {
        loading: false,
        orders: {
            completedOrders: [],
            pendingOrders: {
                sellerOrders: [],
                buyerOrders: []
            },
        },
        snack: {
            open: false,
            severity: "",
            message: ""
        },
        modal: false
    },
    reducers: {
        handleLoading(state, action) {
            state.loading = action.payload
        },
        handleSnack(state, action) {
            state.snack = action.payload
        },

        addnewEntryLocal(state, action) {
            const newEntry = action.payload.newEntry
            const entryOrderType = action.payload.newEntry.order_type
            const entryIndex = action.payload.entryIndex

            if (entryOrderType === "seller") {
                state.orders.pendingOrders.sellerOrders[entryIndex].quantity += newEntry.quantity
            }
            else if (entryOrderType === "buyer") {
                state.orders.pendingOrders.buyerOrders[entryIndex].quantity += newEntry.quantity
            }
            else {
                state.loading = false;
                state.snack = {
                    open: true,
                    severity: "error",
                    message: "Invalid Entry"
                }
            }

        },

        updateOrdersInLocal(state, action) {

            const newEntry = action.payload.newEntry
            const entryIndex = action.payload.entryIndex

            if (newEntry.order_type === "seller") {
                const thisOrder = state.orders.pendingOrders.buyerOrders[entryIndex]
                switch (true) {
                    case (thisOrder.quantity === newEntry.quantity):

                        state.orders.pendingOrders.buyerOrders.splice(entryIndex, 1)

                        break;

                    case (thisOrder.quantity < newEntry.quantity):

                        const thisOrderId = thisOrder._id
                        const thisOrderQuantity = thisOrder.quantity

                        state.orders.pendingOrders.buyerOrders.splice(entryIndex, 1)

                        state.orders.pendingOrders.sellerOrders.unshift({
                            _id: thisOrderId,
                            order_type: "seller",
                            price: newEntry.price,
                            quantity: newEntry.quantity - thisOrderQuantity
                        })
                        break;

                    case (thisOrder.quantity > newEntry.quantity):

                        state.orders.pendingOrders.buyerOrders[entryIndex].quantity -= newEntry.quantity

                        break;


                }
            }

            else if (newEntry.order_type === "buyer") {
                const thisOrder = state.orders.pendingOrders.sellerOrders[entryIndex]
                switch (true) {
                    case (thisOrder.quantity === newEntry.quantity):

                        state.orders.pendingOrders.sellerOrders.splice(entryIndex, 1)

                        break;

                    case (thisOrder.quantity < newEntry.quantity):

                        const thisOrderId = thisOrder._id
                        const thisOrderQuantity = thisOrder.quantity

                        state.orders.pendingOrders.sellerOrders.splice(entryIndex, 1)

                        state.orders.pendingOrders.buyerOrders.unshift({
                            _id: thisOrderId,
                            order_type: "buyer",
                            price: newEntry.price,
                            quantity: newEntry.quantity - thisOrderQuantity
                        })
                        break;

                    case (thisOrder.quantity > newEntry.quantity):

                        state.orders.pendingOrders.sellerOrders[entryIndex].quantity -= newEntry.quantity

                        break;


                }
            }

            else {
                state.loading = false;
                state.snack = {
                    open: true,
                    severity: "error",
                    message: "Invalid Entry"
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrders.fulfilled, (state, action) => {

            state.orders.pendingOrders.buyerOrders = action.payload.orders.pending_orders.filter((item) => {
                return item.order_type === "buyer"
            })

            state.orders.pendingOrders.sellerOrders = action.payload.orders.pending_orders.filter((item) => {
                return item.order_type === "seller"
            })


            state.orders.completedOrders = action.payload.orders.completed_orders
            state.loading = false
        }),

            builder.addCase(getOrders.rejected, (state, action) => {
                state.loading = false,
                    state.snack = {
                        open: true,
                        severity: "error",
                        message: "failed to fetch orders"
                    }
            })
        builder.addCase(createEntry.fulfilled, (state, action) => {


            if (action.payload.new_entry) {
                if (action.payload.new_entry[0].order_type === "seller") {
                    state.orders.pendingOrders.sellerOrders.unshift(action.payload.new_entry[0])
                }
                else if (action.payload.new_entry[0].order_type === "buyer") {
                    state.orders.pendingOrders.buyerOrders.unshift(action.payload.new_entry[0])
                }
            }

            if (action.payload.completed_order_entry) {
                state.orders.completedOrders.unshift(action.payload.completed_order_entry[0])
            }

            state.snack = {
                open: true,
                severity: "success",
                message: action.payload.message,
            }
            state.loading = false
        }),
            builder.addCase(createEntry.rejected, (state, action) => {
                state.loading = false,
                    state.snack = {
                        open: true,
                        severity: "error",
                        message: "failed to create entry"
                    }
            })
    }
})


export default orders.reducer

export { getOrders, createEntry }

export const { handleLoading, handleSnack, updateOrdersInLocal, addnewEntryLocal } = orders.actions

