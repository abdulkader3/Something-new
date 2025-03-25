import React, { useEffect, useState } from "react";
import "./UserNavbar.css";
import { Link } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { useSelector } from "react-redux";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { Bounce, toast } from "react-toastify";
import { FaHistory } from "react-icons/fa";

const UserNavbar = () => {
  const clintInfo = useSelector((state) => state.info.userdata);
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");

  const auth = getAuth();
  const db = getDatabase();

  const toggleProfileVisibility = () => {
    setProfileVisible((prev) => !prev);
  };

  const logout = () => {
    localStorage.clear();
    location.reload();
  };

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

  const handleSetPin = async () => {
    const isAuthenticated = await reauthenticateUser();
    if (isAuthenticated) {
      await set(ref(db, `ClintList/${auth.currentUser.uid}/pin`), pin);
      toast("Your PIN has been set", {
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
      toggleProfileVisibility();
    } else {
      alert("Incorrect password. Please try again.");
    }
  };
  // =============history page

  const [history, sethistory] = useState([]);

  const [one, tow] = useState(false);
  const flipHistory = () => {
    tow(!one);
  };

  // for history

  useEffect(() => {
    const clintListRef = ref(db, `ClintList/${clintInfo?.uid}`);
    onValue(clintListRef, (snapshot) => {
      const clintData = [];
      snapshot.forEach((childSnapshot) => {
        const historyData = [];
        childSnapshot.forEach((subChildSnapshot) => {
          historyData.push({
            ...subChildSnapshot.val(),
            key: subChildSnapshot.key,
          });
        });
        clintData.push({
          ...childSnapshot.val(),
          key: childSnapshot.key,
          history: historyData,
        });
      });
      sethistory(clintData);
    });
  }, [db]);

  // for history


  // user balance
  
  const [data, setData] = useState([]);
  const [dataB, setDataB] = useState([]);


  useEffect(() => {
    const clintListRef = ref(db, "ClintList/");
    onValue(clintListRef, (snapshot) => {
      const clintData = [];
      snapshot.forEach((childSnapshot) => {
        clintData.push({ ...childSnapshot.val(), key: childSnapshot.key });
      });
      setData(clintData);
    });
  }, [db]);


  useEffect(()=>{
    data.map((BLANCE)=>{
      if(BLANCE.key == clintInfo.uid){
      setDataB(BLANCE)
    }
    })

    
  },[data])
  // user balance
  return (
    <>
      <div className="w-full relative">
        {/* Top Navigation */}
        <div className="homeNav w-full h-[60px] md:h-[100px] bg-white flex items-center justify-between p-5 md:p-10 lg:p-20">
          <Link to="/addmoney" className="border py-2 px-4 rounded-full">
            {dataB?.balance ?? "00.00"} TK
          </Link>

          <h2>{clintInfo?.displayName}</h2>
          <img
            onClick={toggleProfileVisibility}
            className="w-[30px] md:w-[70px] lg:w-[100px] overflow-hidden rounded-full cursor-pointer"
            src={clintInfo?.photoURL}
            alt="profile"
          />
        </div>

        {/* Profile Popup */}
        {isProfileVisible && (
          <div className="w-full h-screen bg-transparent ProfilePage absolute z-10">
            {one && (
              <div className="w-full h-screen bg-[#000000eb] absolute ">
                <div className="w-full text-[30px] my-10">
                  <IoChevronBackOutline onClick={flipHistory} />
                </div>

                <div className="w-full h-[390px] overflow-y-scroll pl-4 flex flex-col gap-4 ">
                  {history.map((transHistory) => (
                    <div
                      key={transHistory?.key}
                      className="w-full flex flex-col gap-1"
                    >
                      <div className=" flex gap-1">
                        <p> {transHistory?.timeOfhistory}</p>
                        <p> {transHistory?.balanceHistory}</p>
                        <p> {transHistory?.Newbalance} </p>
                      </div>
                      <div className="w-fit h-fit bg-[#ffffff9f] text-black rounded-md px-2">
                        {transHistory?.statuSHistory}{" "}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full flex justify-between text-[30px] my-10">
              <IoChevronBackOutline onClick={toggleProfileVisibility} />
              <FaHistory onClick={flipHistory} />
            </div>

            {/* Password Input */}
            <div className="w-full h-[40px] rounded-full">
              <input
                className="w-full h-full rounded-full text-black pl-5"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* PIN Input */}
            <div className="w-full h-[40px] rounded-full my-10">
              <input
                className="w-full h-full rounded-full text-black pl-5"
                type="text"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>

            {/* Set PIN Button */}
            <button
              onClick={handleSetPin}
              className="w-full active:scale-95 transition-all mt-2 bg-blue-500 text-white rounded-full py-2"
            >
              Set PIN
            </button>

            {/* Log Out */}
            <div
              onClick={logout}
              className="flex items-center justify-center text-black mt-20 cursor-pointer"
            >
              <div className="w-[100px] flex items-center gap-1 bg-white h-[40px] rounded-full justify-center">
                <LuLogOut className="rotate-180" /> <button>Log Out</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserNavbar;
