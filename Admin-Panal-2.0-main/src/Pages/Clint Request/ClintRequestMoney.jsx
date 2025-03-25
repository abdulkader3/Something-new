import React, { useEffect, useState } from "react";
import {getDatabase, ref, onValue, update, remove, push, set,} from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdHomeFilled, MdPendingActions } from "react-icons/md";
import { IoIosCloudDone } from "react-icons/io";
import { FaHistory, FaUsersCog } from "react-icons/fa";
import { useSelector } from "react-redux";

const ClintRequestMoney = () => {
  const AdminData = useSelector((state) => state.info.userdata);
  const [requests, setRequests] = useState([]);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  // Firebase
  const db = getDatabase();
  useEffect(() => {
    const starCountRef = ref(db, "client_money_request/");
    onValue(starCountRef, (snapshot) => {
      let box = [];
      snapshot.forEach((paisa) => {
        box.push({ ...paisa.val(), key: paisa.key });
      });
      setRequests(box);

      if (box.length > 0) {
        setHasNewRequests(true);
      }
    });
  }, [db]);

  //   ======================approve button=================================
  const [nnote, setnnote] = useState("");
  const noteUpdate = (e) => {
    setnnote(e.target.value);
  };

  // real time Clock
  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
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


  const handelDiclaind = (CatcH)=>{
    remove(ref(db, `client_money_request/${CatcH.key}`), {
    });
  }

  

  const handleApprove = (request) => {
    // a new list for history
    set(push(ref(db, "AdminTlist/")), {
      Amount: request.Amount,
      ClintNAME: request.ClintNAME,
      ClintPHOTO: request.ClintPHOTO,
      ClintUID: request.ClintUID,
      Message: request.Message,
      Time: request.Time,
      dateOf: formatDate(DATE),
    });
    // a new list for history
    const clientRef = ref(db, "ClintList/" + request.ClintUID + "/balance");
    const requestRef = ref(db, "client_money_request/" + request.key);
    // First, get the current balance
    onValue(
      clientRef,
      (snapshot) => {
        const currentBalance = snapshot.val() || 0;
        // Calculate the new balance
        const newBalance = currentBalance + request.Amount;
        // Update Firebase with the new balance
        update(ref(db, "ClintList/" + request.ClintUID), {
          balance: newBalance,
        })
          .then(() => {
            remove(requestRef)
              .then(() => {
                update(push(ref(db, "ClintList/" + request.ClintUID)), {
                  balanceHistory: currentBalance + ".Tk +",
                  Newbalance: request.Amount + ".Tk",
                  statuSHistory: nnote,
                  timeOfhistory: formatAMPM(new Date()) + "👉",
                });
              })
              .catch((error) =>
                console.error("Error removing request:", error)
              );
          })
          .catch((error) => {
            console.error("Error updating balance:", error);
          });
      },
      {
        onlyOnce: true,
      }
    );

    alert('একাউন্টে টাকা পৌঁছে গেছে')
  };
  // Function to clear the new request indicator
  const handleIconClick = () => {
    setHasNewRequests(false);
  };
  //   ======================approve button=================================

  return (
    <div className=" w-full h-screen flex flex-col items-center p-4 text-white min-h-screen">
      <div className="w-full">
        <Link to="/" className="w-full mt-5 text-white text-[30px]">
          <IoChevronBackOutline />{" "}
        </Link>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Client Money Requests</h2>
      <div className="w-full h-full mb-[50px] rounded-lg overflow-y-scroll ">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request.key}
              className="bg-gray-800 p-4 mb-4 rounded-md shadow-md"
            >
              <img
                className="w-[50px] rounded-full overflow-hidden "
                src={request?.ClintPHOTO}
                alt="Clint"
              />
              <p>
                <strong>Amount:</strong> {request?.ClintNAME}
              </p>
              <p>
                <strong>Amount:</strong> {request?.Amount}
              </p>
              <p>
                <strong>Message:</strong> {request?.Message}
              </p>
              <p>
                <strong>Time:</strong> {request?.Time}
              </p>
              <p>
                <strong>Date:</strong> {request?.dateOf}
              </p>

              {/* messege box */}
              <div className="w-full h-[100px] bg-transparent  rounded-2xl mt-5 mb-2 ">
                <label htmlFor="massage"></label>
                <textarea
                  onChange={noteUpdate}
                  className="w-full h-full outline-none rounded-2xl p-5 bg-transparent border-[3px] "
                  name="massage"
                  id="massage"
                ></textarea>
              </div>
              {/* messege box */}

             <div className=" w-full flex justify-between">
             <button
                onClick={() => handleApprove(request)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
              >
                OK
              </button>
              
              
              <button
                onClick={() => handelDiclaind(request)}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Decline
              
              
          </button>
             </div>
            </div>
          ))
        ) : (
          <p>No requests found.</p>
        )}
      </div>

      <div className="bg-[#000000c6] flex items-center justify-between px-5 absolute w-full h-[40px] transition-all rounded-lg mt-4 bottom-4 md:bottom-6 lg:bottom-10 hover:scale-95">
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
          onClick={handleIconClick}
          className="relative hover:scale-125 active:scale-100 transition-all"
        >
          <FaUsersCog className="text-white text-[30px]" />
          {hasNewRequests && (
            <span className="absolute top-0 right-0 bg-red-500 rounded-full h-2 w-2"></span>
          )}
        </Link>
        <Link
          to="/history"
          className="hover:scale-125 active:scale-100 transition-all"
        >
          <FaHistory className="text-white text-[30px]" />
        </Link>
      </div>
    </div>
  );
};

export default ClintRequestMoney;
