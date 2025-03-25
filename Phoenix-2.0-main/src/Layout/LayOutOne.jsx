import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

const LayOutOne = () => {

  // Security
  const navigate = useNavigate()
  const userDataFromRedux = useSelector((state)=>state.info.userdata)

  useEffect(()=>{
    if(userDataFromRedux == null ){
      navigate('/login')
    }
  },[])
  
  return (
    <div>

        <Outlet/>
      
    </div>
  )
}

export default LayOutOne
