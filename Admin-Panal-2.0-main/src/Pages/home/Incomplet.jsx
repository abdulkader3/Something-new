import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getDatabase, push, ref, set } from "firebase/database";
import { MdHomeFilled, MdPendingActions } from "react-icons/md";
import { IoIosCloudDone } from "react-icons/io";
import { FaHistory, FaUsersCog } from "react-icons/fa";

// firebase
import { onValue } from "firebase/database";
import { clintData } from "../../Slice/SliceClint";


const Incomplet = () => {
  const clintInfo = useSelector((state) => state.info.userdata);

  const [one, tow] = useState(false);
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const auth = getAuth();

  const ProfileNext = () => {
    tow(!one);
  };

  const logout = () => {
    localStorage.clear();
    location.reload();
  };

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
      alert("PIN set successfully!");
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  // state for firebase data
  const [allRequest, setAllRequest] = useState([]);
  // firebase
  const db = getDatabase();

  useEffect(() => {
    const starCountRef = ref(db, "ListOfRequest/");
    onValue(starCountRef, (snapshot) => {
      let box = [];

      snapshot.forEach((items) => {
        if (items.val().statuss === false) {
          box.push({ ...items.val(), key: items.key });
        }
      });
      setAllRequest(box);
    });
  }, []);

  // to the next page
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const nextPage = (dataofclintRequest) => {
    dispatch(clintData(dataofclintRequest));

    localStorage.setItem("clintDataStore", JSON.stringify(dataofclintRequest));

    navigate("/clintrequest");
  };
  // to the next page

  // for notification dot
  const [hasNewRequests, setHasNewRequests] = useState(false); // State for new requests
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "client_money_request/");
    onValue(starCountRef, (snapshot) => {
      let box = [];

      snapshot.forEach((paisa) => {
        box.push({ ...paisa.val(), key: paisa.key });
      });
      setRequests(box);

      if (box.length > 0) {
        setHasNewRequests(true); // Set indicator when new requests are found
      }
    });
  }, [db]);
  // for notification dot



  const [oparetor , setOparetor] = useState('')
  const [GB , setGB] = useState('')
  const [min , setMin] = useState('')
  const [date , setDate] = useState('')
  const [Taka , setTaka] = useState('')





 const SEToffer = ()=>{

  if(!oparetor || !GB || !min || !date || !Taka ){
    alert('you ofer not complete')
  }else{
    set(push(ref(db, 'MBminOfer/')), {
    BLofGrameen: oparetor,
    Net: GB,
    Min : min,
    dateOffer : date,
    TakaOffer : Taka
  });

  alert('offer set done')

 
  }
  
 }



  const onchangOpater = (e)=>{

    setOparetor(e.target.value)

  }
  const onchangBG = (e)=>{

    setGB(e.target.value)

  }
  const onchangmin = (e)=>{

    setMin(e.target.value)

  }
  const onchangdate = (e)=>{

    setDate(e.target.value)

  }
  const onchangTaka = (e)=>{

    setTaka(e.target.value)

  }




  return (
    <>
      <div className=" homePage ">
        <div className="w-full relative font-bold">
          {/* top */}
          <div
            onClick={ProfileNext}
            className=" homeNav w-full h-[60px] md:h-[100px] bg-white flex items-center justify-between p-5 md:p-10 lg:p-20 "
          >
            {/* <div className=" border py-2 px-4 rounded-full ">♾️ TK</div> */}
            <h2>{clintInfo?.displayName} </h2>
            <img
              className="w-[30px] md:w-[70px] lg:w-[100px] overflow-hidden rounded-full "
              src={clintInfo?.photoURL}
              alt="profile"
            />
          </div>
          {/* top */}

          {one && (
            <div className="w-full h-screen bg-transparent ProfilePage absolute z-10 ">
              <div className="w-full mt-5 text-[30px] ">
                <IoChevronBackOutline onClick={ProfileNext} />
              </div>

              {/* Password input */}
              <div className="w-full h-[40px] rounded-full mt-20 ">
                <input
                  className="w-full h-full bg-[#1c1c1c68] rounded-full text-black pl-5 "
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* PIN input */}
              <div className="w-full h-[40px] rounded-full my-5 ">
                <input
                  className="w-full h-full bg-[#1c1c1c68] rounded-full text-black pl-5"
                  type="text"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>

              {/* Set PIN button */}
              <button
                onClick={handleSetPin}
                className="w-full mt-2 bg-[#000000c6] text-white rounded-full py-2"
              >
                Set PIN
              </button>

              <div
                onClick={logout}
                className=" flex items-center justify-center text-black  "
              >
                <div className=" w-[140px] flex items-center gap-1 bg-[#00000038] text-white h-[40px] font-bold  rounded-full justify-center mt-20  ">
                  <LuLogOut className=" rotate-180" />{" "}
                  <button> Log Out </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <h3 className="text-white text-center font-bold text-2xl ">Set MB Minute Offers</h3>

        <div className="w-full">
          <input onChange={onchangOpater} className="w-full h-[35px] rounded-full pl-5 mt-5 " type="text" placeholder="Oparetor" />
          <input onChange={onchangBG} className="w-full h-[35px] rounded-full pl-5 mt-5 " type="text" placeholder="00.0 GB" />
          <input onChange={onchangmin} className="w-full h-[35px] rounded-full pl-5 mt-5 " type="text" placeholder="00min 0s " />
          <input onChange={onchangdate} className="w-full h-[35px] rounded-full pl-5 mt-5 " type="text" placeholder="Date" />
          <input onChange={onchangTaka} className="w-full h-[35px] rounded-full pl-5 mt-5 " type="text" placeholder="00.0 .Tk" />
        </div>

        <button onClick={SEToffer} className="w-full bg-[#ffa14f] mt-20 py-2 rounded-full text-white font-bold border active:scale-95 transition-all"> SET Offer</button>

        

        {/* add money button */}
        <div className=" bg-[#000000c6] flex items-center justify-between  px-5 absolute w-full h-[40px] transition-all rounded-lg mt-4 bottom-4 md:bottom-6 lg:bottom-10 hover:scale-95">
          <Link
            to="/"
            className="hover:scale-125 active:scale-100 transition-all"
          >
            <MdHomeFilled className="text-white text-[30px]" />
          </Link>
          <Link
            to="/incomplete"
            className="hover:scale-125 active:scale-100 transition-all"
          >
            <MdPendingActions className="text-white text-[30px]" />
          </Link>
          <Link
            to="/complete"
            className="hover:scale-125 active:scale-100 transition-all"
          >
            <IoIosCloudDone className="text-white text-[30px]" />
          </Link>
          <Link
            to="/moneyrequest"
            className="relative hover:scale-125 active:scale-100 transition-all"
          >
            <FaUsersCog className="text-white text-[30px]" />
            {hasNewRequests && (
              <span className="absolute top-0 right-0 bg-red-500 rounded-full h-2 w-2"></span>
            )}
          </Link>
          <Link to='/history' className="hover:scale-125 active:scale-100 transition-all">
            <FaHistory className="text-white text-[30px]" />
          </Link>
        </div>
        {/* add money button */}
      </div>
    </>
  );
};

export default Incomplet;
