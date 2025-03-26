import React, { useEffect, useState } from "react";
import "./Transfer.css";
import UserNavbar from "../../Components/User navbar/UserNavbar";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, onValue, push, ref, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";

const TransferBalence = () => {

   // data of current user from redux
   const ClintData = useSelector((state) => state.info.userdata);

   // manage state
   const [category] = useState("FlexyLoade");
   const [categoryPhoto] = useState(
     "https://media.istockphoto.com/id/1141778521/vector/mobile-phone-vibrating-or-ringing-flat-vector-icon-for-apps-and-websites.jpg?s=612x612&w=0&k=20&c=DdQVkRexW_o2b86c4yqz24UpNpUA0IIVTS2_tFXECjo="
   );
   const [paisa, setTaka] = useState();
   const [money, setMoney] = useState("");
   const [type, setType] = useState("");
   const [account, setAccount] = useState("");
   const [security, setSecurity] = useState("");
   const [securityFirebase, setSecurityFirebase] = useState("");
 
   
 
   // Pin of input
   const Pin = (e) => {
     setSecurity(e.target.value);
   };
   // Taka of input
   const Taka = (e) => {
     setTaka(e.target.value);
   };
   // number of input
   const AccountNumber = (e) => {
     setAccount(e.target.value);
   };
 
   // Send money of cash out
   const Money = (e) => {
     setMoney(e.target.id);
   };
   // Send money of cash out
   const Dhoron = (e) => {
     setType(e.target.id);
   };
 
   // real time Clock
   function formatAMPM(date) {
     var hours = date.getHours();
     var minutes = date.getMinutes();
     var ampm = hours >= 12 ? "pm" : "am";
     hours = hours % 12;
     hours = hours ? hours : 12; // the hour '0' should be '12'
     minutes = minutes < 10 ? "0" + minutes : minutes;
     var strTime = hours + ":" + minutes + " " + ampm;
     return strTime;
   }
   // real time Clock

   // date 
  const formatDate = (date) => {
    const month = date.getMonth() + 1;  // Months are 0-indexed, so add 1
    const day = date.getDate();
    const year = date.getFullYear();
  
    // Ensure single-digit days or months are padded with a leading zero
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;
  
    return `${formattedMonth}/${formattedDay}/${year}`;
  };
  
  const DATE = new Date();

  // date
 
   // firebase
   const db = getDatabase();
   const goBack = useNavigate();
 
 
 
 
   const BalanceSetData = () => {
       if (!account || account <= 11) {
      alert("আপনাকে নাম্বার দিতে হবে");
      return;
    }
     // Check if the amount is zero or not provided
     if (!paisa || paisa <= 19) {
      alert("লেনদেনের জন্য পরিমাণ কম");
      return;
    }
    if (!paisa || paisa >= 99999) {
      alert("লেনদেনের জন্য পরিমাণ বেশি");
      return;
    }
    
      // Check if the given amount exceeds the current balance
    if (paisa > bortomanBL) {
      alert("আপনার একাউন্টে পর্যাপ্ত পরিমাণ ব্যালেন্স নেই");
      return;
    }
     if (security == securityFirebase.pin) {
       update(ref(db, "ClintList/" + ClintData.uid), {
         balance: newBALANCE
       });
       set(push(ref(db, "ListOfRequest/")), {
         time: formatAMPM(new Date()),
         clintId: ClintData.uid,
         clintName: ClintData.displayName,
         clintPhoto: ClintData.photoURL,
         methodOf: category,
         photoOfmethod: categoryPhoto,
         type: money,
         accountnumber: account,
         accounttype: type,
         statuss: false,
         amount: paisa,
         buttonDone: true,
        buttonPainding: true,
        ReturnStatus: false,
        ReturnStatusBG: true ,
        dateOf: formatDate(DATE),

 
 
       });
       goBack("/");
     } else {
       alert("Wrong Pin");
     }
   };
 
   // security
   useEffect(() => {
     const starCountRef = ref(db, "ClintList/" + ClintData.uid);
     onValue(starCountRef, (snapshot) => {
       const data = snapshot.val();
       setSecurityFirebase(data);
     });
   }, []);
   // security
 
   const auth = getAuth();
 
 
   const [data, setData] = useState([]);
   const [userERbalance , setuserERbalance ] = useState()
   const bortomanBL = userERbalance?.balance;
   const newBALANCE = bortomanBL - paisa;
  
  
   useEffect(() => {
     const starCountRef = ref(db, "ClintList/");
     onValue(starCountRef, (snapshot) => {
       const clintData = [];
       snapshot.forEach((BL) => {
         clintData.push({ ...BL.val(), key: BL.key });
       
       });
 
       setData(clintData);
     });
   }, []);
   useEffect(() => {
     data.map((item) => {
       if (item.key === ClintData.uid) {
         setuserERbalance(item);
       }
     });
   }, [data]);



  return (
    <>
      <div className=" transferMain text-white ">
        <UserNavbar />
        <div className="px-2 md:px-[100px]">
          <div className="w-full flex justify-between items-center mt-10 px-3 ">
            <div className="w-[150px] relative  ">
              <input
              onChange={Taka}
                className=" outline-none text-purple-700 border amount pl-5 w-[150px]  h-full rounded-md "
                type="number"
                placeholder="Amount"
              />
              <p className=" absolute top-0 right-5 text-[#32323288] ">TK</p>
            </div>

            <Link className=" flex flex-col items-center ml-4 " to="#">
              {" "}
              <img
                className=" w-[30px] overflow-hidden rounded-xl "
                src="https://media.istockphoto.com/id/1141778521/vector/mobile-phone-vibrating-or-ringing-flat-vector-icon-for-apps-and-websites.jpg?s=612x612&w=0&k=20&c=DdQVkRexW_o2b86c4yqz24UpNpUA0IIVTS2_tFXECjo="
                alt="option"
              />{" "}
              Balence{" "}
            </Link>
          </div>

          

          <div className="w-full mt-10 px-5 relative ">
            <input
            onChange={AccountNumber}
              className=" border outline-none text-purple-700 amount pl-5 w-full h-[50px]  rounded-md "
              type="number"
              placeholder="Number"
            />
            <p className=" absolute top-3 right-10 text-[#32323288] ">
              {" "}
              Balence
              {" "}
            </p>
          </div>

          {/* AAgent or personal*/}
          
          {/* AAgent or personal*/}

          <div className=" w-full mt-20 ">
          <input
          onChange={Pin}
              className=" pinPlace border outline-none text-purple-700 amount pl-5 w-full h-[50px] text-[45px]  rounded-md "
              type="number"
              placeholder="  *    *    *    *   "
            />
          </div>

          <button onClick={BalanceSetData} className=" w-full bg-white text-blue-700 mt-20 rounded-lg font-bold hover:scale-95 active:scale-100 transition-all py-4 ">
            {" "}
            Send{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default TransferBalence;
