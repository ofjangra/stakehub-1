import { useEffect } from 'react'
import React from 'react'
import './App.css'
import { useSelector, useDispatch } from 'react-redux'
import { getOrders, handleLoading } from './store/orders'
import RouteLayout from './RouteLayout'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { handleSnack } from './store/orders'
import Nav from './components/Nav'
import Preload from './components/Preload'
function App() {

  const dispatch = useDispatch()
  const snackMessage = useSelector((state) => state.orders.snack)
  const loading = useSelector((state) => state.orders.loading)
  useEffect(() => {
    dispatch(handleLoading(true))
    dispatch(getOrders())
  }, [])

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(handleSnack({
      ...snackMessage,
      open: false
    }))
  };



  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <>
      {
        loading ? <Preload /> :
          <>
            <Nav />
            <Snackbar open={snackMessage.open} autoHideDuration={5000} onClose={handleSnackClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
              <Alert severity={snackMessage.severity} sx={{ width: '100%' }} onClose={handleSnackClose}>
                <span>{snackMessage.message}</span>
              </Alert>
            </Snackbar>

            <RouteLayout />
          </>
      }
    </>
  )
}

export default App