import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './Pages/login/Login'
import Registration from './Pages/registration/Registration'
import Home from './Pages/home/Home'
import app from './firebase.config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayOutOne from './Layout/LayOutOne'
import ClintRequest from './Pages/Clint Request/ClintRequest'
import Incomplet from './Pages/home/Incomplet'
import Complete from './Pages/home/Complete'
import ClintRequestMoney from './Pages/Clint Request/ClintRequestMoney'
import History from './Pages/history/History'


function App() {

  const Phoenix = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<LayOutOne/>}>
        <Route index element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/registration' element={<Registration/>}/>
        <Route path='/clintrequest' element={<ClintRequest/>}/>
        <Route path='/incomplete' element={<Incomplet/>}/>
        <Route path='/complete' element={<Complete/>}/>
        <Route path='/moneyrequest' element={<ClintRequestMoney/>}/>
        <Route path='/history' element={<History/>}/>
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
