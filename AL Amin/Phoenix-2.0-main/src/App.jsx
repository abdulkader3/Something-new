import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './Pages/login/Login'
import Registration from './Pages/registration/Registration'
import Home from './Pages/home/Home'
import Transfer from './Pages/transfer/Transfer'
import app from './firebase.config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransferNagad from './Pages/transfer/TransferNagad'
import TransferRocket from './Pages/transfer/TransferRocket'
import TransferOpay from './Pages/transfer/TransferOpay'
import TransferBalence from './Pages/transfer/TransferBalence'
import TransferMinute from './Pages/transfer/TransferMinute'
import TransferMB from './Pages/transfer/TransferMB'
import TransferISmart from './Pages/transfer/TransferISmart'
import TransferBank from './Pages/transfer/TransferBank'
import LayOutOne from './Layout/LayOutOne'
import AddMoney from './Pages/Add money/AddMoney'
import ClintRequest from './Pages/home/Clint Request/ClintRequest'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Dollar from './Pages/transfer/Dollar'

function App() {

  const Phoenix = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<LayOutOne/>}>
        <Route index element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/registration' element={<Registration/>}/>
        <Route path='/addmoney' element={<AddMoney/>}/>
        
        <Route path='/transfer' element={<Transfer/>}/>
        <Route path='/transfernagad' element={<TransferNagad/>}/>
        <Route path='/transferrocket' element={<TransferRocket/>}/>
        <Route path='/transferopay' element={<TransferOpay/>}/>
        <Route path='/transferbalence' element={<TransferBalence/>}/>
        <Route path='/transferminute' element={<TransferMinute/>}/>
        <Route path='/transfermd' element={<TransferMB/>}/>
        <Route path='/transferismart' element={<TransferISmart/>}/>
        <Route path='/transferbank' element={<TransferBank/>}/>
        <Route path='/clintrequest' element={<ClintRequest/>}/>
        <Route path='/dollar' element={<Dollar/>}/>
      </Route>
    )
  )


  return (
    <>

    <RouterProvider router={Phoenix}/>
    <ToastContainer />

    </>
  )
}

export default App
