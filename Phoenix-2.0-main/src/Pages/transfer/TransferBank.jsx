import React, { useEffect, useState } from "react";
import "./Transfer.css";
import UserNavbar from "../../Components/User navbar/UserNavbar";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, onValue, push, ref, set, update } from "firebase/database";
import { useSelector } from "react-redux";
import { data } from "autoprefixer";

const TransferBank = () => {
  // data of current user from redux
  const ClintData = useSelector((state) => state.info.userdata);

  


  // manage state
  const [category] = useState("Bank");
  const [categoryPhoto] = useState(
    "https://cdn.pixabay.com/photo/2023/12/26/04/55/bank-8469480_960_720.png"
  );
  const [paisa, setTaka] = useState("");
  const [account, setAccount] = useState("");
  const [security, setSecurity] = useState("");
  const [securityFirebase, setSecurityFirebase] = useState("");
  const [Beneficiary, setBeneficiary] = useState("");
  const [Bank, setBank] = useState("");
  const [District, setDistrict] = useState("");
  const [Branch, setBranch] = useState("");


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
  // Beneficiary of input
  const BeneficiaryOnchange = (e) => {
    setBeneficiary(e.target.value);
  };
  // Bank of input
  const BankOnchange = (e) => {
    setBank(e.target.value);
  };
  // District of input
  const DistrictOnchange = (e) => {
    setDistrict(e.target.value);
  };
  // Branch of input
  const BranchOnchange = (e) => {
    setBranch(e.target.value);
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

  const bankSetData = () => {
    if (!account || account <= 11) {
      alert("আপনাকে নাম্বার দিতে হবে");
      return;
    }
      // Check if the amount is zero or not provided
      if (!paisa || paisa <= 99) {
        alert("লেনদেনের জন্য পরিমাণ কম");
        return;
      }
      if (!paisa || paisa >= 200001) {
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
        amount: paisa,
        accountnumber: account,
        beneficiaryName: Beneficiary,
        bank: Bank,
        district: District,
        branch: Branch,
        statuss: false,
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
                src="https://cdn.pixabay.com/photo/2023/12/26/04/55/bank-8469480_960_720.png"
                alt="option"
              />{" "}
              Bank transfer{" "}
            </Link>
          </div>

          {/* name list */}

          <p className="font-bold mt-10">Beneficiary Name :</p>

          <div className=" w-full h-[50px] rounded-2xl border  overflow-x-scroll  mt-2 ">
            <input
              onChange={BeneficiaryOnchange}
              className="w-full h-full outline-none text-black"
              type="text"
            />
          </div>

          {/* name list */}
          {/* bank list */}

          <p className="font-bold mt-2">Bank :</p>

          <div className=" w-full h-[50px] rounded-2xl border  overflow-x-scroll  mt-2 ">
            <input
              onChange={BankOnchange}
              className="w-full h-full outline-none text-black"
              type="text"
            />
          </div>

          {/* bank list */}

          {/* city list */}
          <p className="font-bold mt-2">District :</p>
          <div className=" w-full h-[50px] rounded-2xl border  overflow-x-scroll mt-2  ">
            <input
              onChange={DistrictOnchange}
              className="w-full h-full outline-none text-black"
              type="text"
            />
          </div>
          {/* city list */}

          {/* branch list */}
          <p className="font-bold mt-2">Branch :</p>
          <div className=" w-full h-[50px] rounded-2xl border  overflow-x-scroll mt-2  ">
            <input
              onChange={BranchOnchange}
              className="w-full h-full outline-none text-black"
              type="text"
            />
          </div>
          {/* branch list */}

          <div className="w-full mt-5 px-5 relative ">
            <input
              onChange={AccountNumber}
              className=" border outline-none text-purple-700 amount pl-5 w-full h-[50px]  rounded-md "
              type="number"
              placeholder="A/C"
            />
            <p className=" absolute top-3 right-10 text-[#32323288] ">
              {" "}
              Number{" "}
            </p>
          </div>

          <div className=" w-full mt-10 ">
            <input
              onChange={Pin}
              className=" pinPlace border outline-none text-purple-700 amount pl-5 w-full h-[50px] text-[45px]  rounded-md "
              type="number"
              placeholder="  *    *    *    *   "
            />
          </div>

          {/* messege box */}
          <div className="w-full h-[150px] bg-transparent  rounded-2xl mt-10 ">
            <label htmlFor="massage"></label>
            <textarea
              className="w-full h-full outline-none rounded-2xl p-5 bg-transparent border-[3px] "
              name="massage"
              id="massage"
            ></textarea>
          </div>
          {/* messege box */}

          <button
            onClick={bankSetData}
            className=" w-full bg-white text-blue-700 mt-10 rounded-lg font-bold hover:scale-95 active:scale-100 transition-all py-4 "
          >
            {" "}
            Send{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default TransferBank;
