import React, { useEffect, useState } from "react";
import "./Transfer.css";
import UserNavbar from "../../Components/User navbar/UserNavbar";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, update, set, push } from "firebase/database";
import { useSelector } from "react-redux";


const TransferMB = () => {

  const [Offeers, setOffeers] = useState([])
  const db = getDatabase();
  useEffect(() => {
    const starCountRef = ref(db, 'MBminOfer/');
    onValue(starCountRef, (snapshot) => {

      let box = []
      snapshot.forEach((p) => {
        box.push({ ...p.val() })
      })

      setOffeers(box)


    });
  }, [])
  //updata

  // data of current user from redux
  const ClintData = useSelector((state) => state.info.userdata);

  // manage state
  const [category] = useState("MB & min");
  const [categoryPhoto] = useState(
    "https://media.licdn.com/dms/image/v2/D4E0BAQEFaEHfMWT83g/company-logo_200_200/company-logo_200_200/0/1723750500021/net_research_logo?e=2147483647&v=beta&t=UEfV_r7qIbo4p9exMH2zUQdBc56Vd85nPEs0kkN1ZZo"
  );
  const [account, setAccount] = useState("");
  const [paisa, setTaka] = useState();
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
  const goBack = useNavigate();


  

  const [allOfeers, setallOfeers] = useState([])
  const BkashSetData = () => {
     if (!account || account <= 11) {
      alert("আপনাকে নাম্বার দিতে হবে");
      return;
    }
    // Check if the given amount exceeds the current balance
    if (!paisa || paisa <= 10) {
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
        dateOf: formatDate(DATE),
        clintId: ClintData?.uid,
        clintName: ClintData?.displayName,
        clintPhoto: ClintData?.photoURL,
        amount: paisa,
        methodOf: category,
        photoOfmethod: categoryPhoto,
        statuss: false,
        buttonDone: true,
        buttonPainding: true,
        ReturnStatus: false,
        ReturnStatusBG: true,
        BLofGrameen: allOfeers?.BLofGrameen,
        Min: allOfeers?.Min,
        dateOffer: allOfeers?.dateOffer,
        TakaOffer: allOfeers?.TakaOffer,
        NetOffer: allOfeers?.Net,
        accountnumber: account,

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
  const [userERbalance, setuserERbalance] = useState()
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

  //updata

  const NextOfer = (e) => {
    setallOfeers(e)
    setTaka(e?.TakaOffer)
  }


  const [activeIndex, setActiveIndex] = useState(null); // Track the currently active item

  const handleItemClick = (index, ofer) => {
    setActiveIndex(index); // Set the clicked item's index as active
    NextOfer(ofer); // Pass the offer to your existing logic
  };



  return (
    <>
      <div className=" transferMain text-white ">
        <UserNavbar />
        <div className="px-2 md:px-[100px]">
        <div className="w-full mt-5 px-5 relative ">
            <input
              onChange={AccountNumber}
              className=" border outline-none text-purple-700 amount pl-5 w-full h-[50px]  rounded-md "
              type="number"
              placeholder="Number"
            />
            <p className=" absolute top-3 right-10 text-[#32323288] ">
              {" "}
              Net{" "}
            </p>
          </div>

          {/* bundel updete by admin*/}

          <div className="w-full h-[200px] OfferList ">

            {
              Offeers.map((ofer, index) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(index, ofer)} // Pass the index and offer
                  className={`w-full ${activeIndex === index ? "bg-[#43e327]" : "bg-[#ff8c34]"
                    } p-1 font-bold rounded-xl mt-3 pl-1`}
                >
                  <div className="flex flex-wrap text-[14px] gap-2">
                    <p className="text-[#000]">{ofer?.BLofGrameen}</p>
                    <p className="text-[#ffc12f]">{ofer?.Net}</p>
                    <p className="text-[#64fff2]">{ofer?.Min}</p>
                    <p className="text-[#c340ff]">{ofer?.dateOffer}</p>
                    <p>{ofer?.TakaOffer}</p>
                  </div>
                </div>
              ))
            }







          </div>

          {/* bundel updete by admin*/}

          <div className=" w-full mt-5">
            <input
              onChange={Pin}
              className=" pinPlace border outline-none text-purple-700 amount pl-5 w-full h-[50px] text-[45px]  rounded-md "
              type="number"
              placeholder="  *    *    *    *   "
            />
          </div>

          <button onClick={BkashSetData} className=" w-full bg-white text-blue-700 mt-10 rounded-lg font-bold hover:scale-95 active:scale-100 transition-all py-4 ">
            {" "}
            Send{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default TransferMB;
