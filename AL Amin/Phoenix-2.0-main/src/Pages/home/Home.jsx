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
import { getDatabase, onValue, ref, set } from "firebase/database";
import UserNavbar from "../../Components/User navbar/UserNavbar";
import { FaHistory } from "react-icons/fa";
import SliderComponent from "../../Components/User navbar/SliderComponent";
import { clintData } from "../../Slice/SliceClint";
import { FaUnlock } from "react-icons/fa";

const Home = () => {
  // data from redux
  const clintInfo = useSelector((state) => state.info.userdata);

  // State for mapping data
  const [history, setHistory] = useState([]);

  // Firebase setup
  const db = getDatabase();

  useEffect(() => {
    const starCountRef = ref(db, "ListOfRequest/");
    onValue(starCountRef, (snapshot) => {
      let box = [];
      snapshot.forEach((items) => {
        if (items.val().clintId === clintInfo.uid) {
          box.push({ ...items.val(), key: items.key });
        }
      });
      setHistory(box);
    });
  }, [clintInfo?.uid]);

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
      await set(ref(db, "ClintList/" + clintInfo.uid), pin);
      alert("PIN set successfully!");
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  // new
  const [one1, tow2] = useState(false);
  const flipHistory = () => {
    tow2(!one1);
  };

  // =============history page

  const [historyR, sethistory] = useState([]);

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

  const dis = useDispatch();
  const next = useNavigate();

  const Allinfo = (yes) => {
    localStorage.setItem("clintDataStore", JSON.stringify(yes));
    dis(clintData(yes));
    next("/clintrequest");
  };

  // For lock screenthe

  const [or, yes] = useState([]);
  const [lock, setlock] = useState([]);

  // pin
  const userLockPin = Number(lock.pin);

  const [ScreenPin, setScreenPin] = useState();

  const handleChange = (e) => {
    setScreenPin(e.target.value);
  };
  // pin

  const [flipLock, setFlipLock] = useState(true);

  const FuntionFlipLock = () => {
    if (ScreenPin == userLockPin) {
      setFlipLock(!flipLock);
    } else {
      alert("pin is wrong");
    }
  };
  useEffect(() => {
    const starCountRef = ref(db, "ClintList/");
    onValue(starCountRef, (snapshot) => {
      const box = [];
      snapshot.forEach((items) => {
        const itemData = items.val();
        if (itemData.uid === clintInfo.uid) {
          box.push(itemData);
        }
      });
      yes(box);
    });
  }, [clintInfo.uid]);
  useEffect(() => {
    or.map((er) => setlock(er));
  }, [or]);

  // For lock screenthe

  return (
    <>
      <div className="homePage">
        {flipLock && (
          <div className=" w-full h-screen bg-white absolute z-50 flex items-center ">
            <div className="w-full flex flex-col items-center justify-center ">
              <p className="text-2xl mb-5 font-sans font-medium ">Please enter your PIN</p>
              <div className=" mb-5 w-full h-[50px] border-[2px] border-[#000] rounded-xl ">
                <input
                  onChange={handleChange}
                  className="w-full h-full rounded-xl text-[60px] text-center "
                  type="password"
                />
              </div>
              <button
                onClick={FuntionFlipLock}
                className="w-full h-[40px] rounded-xl bg-black text-[#fff] text-[30px] flex justify-center items-center "
              >
                {" "}
                <FaUnlock />{" "}
              </button>
            </div>
          </div>
        )}

        <div className="w-full relative">
          {/* top */}
          <UserNavbar />
          {/* top */}

          {one && (
            <div className="w-full h-screen bg-transparent ProfilePage absolute z-10">
              <div className="w-full text-[30px] my-10">
                <IoChevronBackOutline onClick={ProfileNext} />
              </div>

              {/* Password input */}
              <div className="w-full h-[40px] rounded-full">
                <input
                  className="w-full h-full rounded-full text-black pl-5"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* PIN input */}
              <div className="w-full h-[40px] rounded-full my-10">
                <input
                  className="w-full h-full rounded-full text-black pl-5"
                  type="text"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>

              {/* Set PIN button */}
              <button
                onClick={handleSetPin}
                className="w-full active:scale-95 transition-all mt-2 bg-blue-500 text-white rounded-full py-2"
              >
                Set PIN
              </button>

              <div
                onClick={logout}
                className="flex items-center justify-center text-black"
              >
                <div className="w-[100px] flex items-center gap-1 bg-white h-[40px] rounded-full justify-center mt-20">
                  <LuLogOut className="rotate-180" /> <button>Log Out</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* option part */}
        <div className="optionPart w-full flex mt-2 p-5 flex-wrap gap-10 text-[12px] font-bold">
          {/* Options */}
          <Link className="flex flex-col items-center ml-0" to="/transfer">
            <img
              className="w-[40px] overflow-hidden rounded-xl"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDVyhgCbIQ8dQDqf2j_x6vWdLtylej4otq1Q&s"
              alt="option"
            />{" "}
            Bkash
          </Link>

          <Link className="flex flex-col items-center" to="/transfernagad">
            {" "}
            <img
              className=" w-[40px] overflow-hidden rounded-xl "
              src="https://downloadr2.apkmirror.com/wp-content/uploads/2020/07/10/5f094774bdb14-384x384.png"
              alt="option"
            />{" "}
            Nagad{" "}
          </Link>
          <Link className="flex flex-col items-center" to="/transferrocket">
            {" "}
            <img
              className=" w-[40px] overflow-hidden rounded-xl "
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa72jjxmBhP7jDcL_d2ONde0G1ztGDxpfe9Q&s"
              alt="option"
            />{" "}
            Rocket{" "}
          </Link>
          <Link className="flex  flex-col items-center" to="/transferopay">
            {" "}
            <img
              className=" w-[40px] overflow-hidden rounded-xl "
              src="https://play-lh.googleusercontent.com/cCVvEEwDQSPmDO8F-kryWhvzy53JllG1FGtHGDG-SDgfVTvvYSvWEXXDbgAY0hf7Bg"
              alt="option"
            />{" "}
            Upay{" "}
          </Link>

          {/* for letter to Enable */}

          <Link className="flex flex-col items-center" to="/transferbalence">
            {" "}
            <img
              className=" w-[40px] overflow-hidden rounded-xl "
              src="https://media.istockphoto.com/id/1141778521/vector/mobile-phone-vibrating-or-ringing-flat-vector-icon-for-apps-and-websites.jpg?s=612x612&w=0&k=20&c=DdQVkRexW_o2b86c4yqz24UpNpUA0IIVTS2_tFXECjo="
              alt="option"
            />{" "}
            Balance{" "}
          </Link>

          {/* <Link
            className="flex ml-4 flex-col items-center"
            to="/transferminute"
          >
            {" "}
            <img
              className=" w-[40px] overflow-hidden rounded-xl "
              src="https://media.istockphoto.com/id/1141778521/vector/mobile-phone-vibrating-or-ringing-flat-vector-icon-for-apps-and-websites.jpg?s=612x612&w=0&k=20&c=DdQVkRexW_o2b86c4yqz24UpNpUA0IIVTS2_tFXECjo="
              alt="option"
            />{" "}
            Minute{" "}
          </Link> */}

          <Link className="flex flex-col items-center" to="/transfermd">
            {" "}
            <img
              className=" w-[40px] overflow-hidden rounded-xl "
              src="photos/mdrcharge.png"
              alt="option"
            />{" "}
            MB{" "}
          </Link>
          <Link className="flex flex-col items-center" to="/dollar">
            {" "}
            <img
              className=" w-[40px] overflow-hidden rounded-xl "
              src="https://play-lh.googleusercontent.com/FxVO4tmAGRfxfbFqM2bumz5Y8FPwsymS1MJLAZ8UtM0DUKGywcBj7-LFZg6YNLRvGgtX"
              alt="option"
            />{" "}
            dollar{" "}
          </Link>

          {/* <Link className="flex flex-col items-center" to="/transferismart">
            {" "}
            <img
              className=" w-[40px] overflow-hidden rounded-xl "
              src="https://play-lh.googleusercontent.com/HMzdrJUMVF1ssfIjsX5kDZ2zQmTJCeyHEZVASXC6aAMZsp-WX2AXP6RECh1x_L44-eI"
              alt="option"
            />{" "}
            IBBL iSmart{" "}
          </Link> */}
          <Link className="flex flex-col items-center" to="/transferbank">
            {" "}
            <img
              className=" w-[40px] overflow-hidden rounded-xl "
              src="https://cdn.pixabay.com/photo/2023/12/26/04/55/bank-8469480_960_720.png"
              alt="option"
            />{" "}
            Bank transfer{" "}
          </Link>
        </div>
        {/* option part */}

        {/* history */}

        <div className="App">
          <SliderComponent />
        </div>

        {/* history */}

        <div className="w-full flex items-center justify-between px-3">
          {/* add money button */}
          <Link
            to="/addmoney"
            className="bg-white flex items-center justify-center font-semibold  px-[15px]  h-[40px] transition-all rounded-lg mt-4 bottom-2 md:bottom-3 lg:bottom-10 hover:scale-95 active:scale-100"
          >
            Add Money
          </Link>
          {/* add money button */}

          <div className=" text-[30px] my-10">
            <FaHistory onClick={flipHistory} className="text-[#fff] " />
          </div>

          {one1 && (
            <div className="w-full h-screen bg-[#ffffffef] absolute top-0 right-0 ">
              <div className="w-full">
                <IoChevronBackOutline
                  onClick={flipHistory}
                  className="text-black text-[30px] ml-2 mt-8  "
                />
              </div>

              <div className="w-full flex justify-center">
                <h4 className="text-[25px] font-bold "> Recharge history </h4>
              </div>

              <div className="w-full h-[190px] overflow-y-scroll pl-4 flex flex-col gap-4 mt-5 bg-[#00000059] rounded-xl ">
                {historyR.map((transHistory) => (
                  <div
                    key={transHistory?.key}
                    className="w-full flex flex-col gap-1 mt-5"
                  >
                    <div className=" flex gap-1 bg-[#000000ab] text-white rounded-md pl-2 ">
                      <p> {transHistory?.timeOfhistory}</p>
                      <p> {transHistory?.balanceHistory}</p>
                      <p> {transHistory?.Newbalance} </p>
                    </div>
                    <div className="w-fit h-fit bg-[#0000009f] text-white rounded-md px-2">
                      {transHistory?.statuSHistory}{" "}
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full flex justify-center mt-1">
                <h4 className="text-[25px] font-bold "> লেনদেন History </h4>
              </div>

              <div className="w-full h-[190px] pt-2 overflow-y-scroll flex flex-col gap-12 mt-5 bg-[#00000059] rounded-xl ">
                {history.map((sob) => (
                  <div
                    onClick={() => Allinfo(sob)}
                    key={sob.key}
                    className={`w-full relative text-[12px] md:text-[18px] h-[40px] flex items-center justify-between p-3 rounded-xl border font-bold  ${
                      sob.status ? "bg-[#4cb81b]" : "bg-[#ff9100d1]"
                    }`}
                  >
                    <img
                      className="w-10 h-10 rounded-md"
                      src={sob?.photoOfmethod}
                      alt="type"
                    />
                    <p>
                      {sob?.ReturnStatus ? "+" : "-"} {sob?.amount}.TK
                    </p>
                    <p>{sob?.accountnumber}</p>
                    <p>{sob?.dateOf}</p>

                    {sob.status && (
                      <div className="w-fit h-full bg-[#ffffff80] absolute bottom-[-40px] right-3 flex justify-center items-center font-bold text-black rounded-md px-2 ">
                        {" "}
                        {sob?.status.PIN}{" "}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
