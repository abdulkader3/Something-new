import React, { useState } from 'react'
import './UserNavbar.css'
import { Link } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { useSelector } from "react-redux";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { Bounce, toast } from 'react-toastify';


const UserNavbar = () => {
   // rudux 
   const clintInfo = useSelector((state)=>state.info.userdata)


   const [one , tow ] = useState(false)
   const [password, setPassword] = useState("");
   const [pin, setPin] = useState("");
   const auth = getAuth();

   const ProfileNext = ()=>{
    tow(!one)
   }


   const logout = ()=>{
    localStorage.clear()
    location.reload()
   }

   // Function to reauthenticate user
   
  const reauthenticateUser = async () => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      console.error("Incorrect password", error);
      return false;
    }
  };

    // Function to set PIN in Realtime Database
    const handleSetPin = async () => {
      const isAuthenticated = await reauthenticateUser();
      if (isAuthenticated) {
        const db = getDatabase();
        await set(ref(db, `ClintList/${auth.currentUser.uid}/pin`), pin);
        toast('your password ben reset', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          });
        tow(!one)


        
      } else {
        alert("Incorrect password. Please try again.");
      }
    };


   
  return (
    <>

     <div className="w-full relative">
      {/* top */}
     <div onClick={ProfileNext} className=" homeNav w-full h-[60px] md:h-[100px] bg-white flex items-center justify-between p-5 md:p-10 lg:p-20 ">
        {/* <div className=" border py-2 px-4 rounded-full "></div> */}
        <h2>{clintInfo?.displayName} </h2>
        <img className='w-[30px] md:w-[70px] lg:w-[100px] overflow-hidden rounded-full ' src={clintInfo?.photoURL} alt="profile" />
      </div>
      {/* top */}

      {one && (
            <div className="w-full h-screen bg-transparent ProfilePage absolute z-10 ">
              <div className="w-full text-[30px] my-10 ">
                <IoChevronBackOutline onClick={ProfileNext} />
              </div>

              {/* Password input */}
              <div className="w-full h-[40px] rounded-full ">
                <input
                  className="w-full h-full rounded-full bg-[#000000a1] pl-5 "
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* PIN input */}
              <div className="w-full h-[40px] rounded-full my-10 ">
                <input
                  className="w-full h-full bg-[#000000a1] rounded-full pl-5"
                  type="text"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>

              {/* Set PIN button */}
              <button onClick={handleSetPin} className="w-full active:scale-95 transition-all mt-2 bg-[#000000a1] text-white rounded-full py-2">
                Set PIN
              </button>

              <div
                onClick={logout}
                className=" flex items-center justify-center text-black  "
              >
                <div className=" w-[100px] flex items-center gap-1 bg-[#00000065] text-white h-[40px] rounded-full justify-center mt-20  ">
                <LuLogOut className=" rotate-180" /> <button> Log Out </button>
                </div>
              </div>
            </div>
          )}
     </div>
      
    </>
  )
}

export default UserNavbar
