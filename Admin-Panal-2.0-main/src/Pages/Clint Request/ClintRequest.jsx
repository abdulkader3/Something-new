import React, { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Clintrequest.css";
import { getDatabase, onValue, ref, set, update } from "firebase/database";
import { IoMdPhotos } from "react-icons/io";


const ClintRequest = () => {
  const clintReqData = useSelector((state) => state.infoclint.value);
  const Admin = useSelector((state) => state.info.userdata);
  const [pinnumber, setpinnumber] = useState("");
  const next = useNavigate();
  const db = getDatabase();
  



  const dhamachapa = clintReqData.buttonDone
  const dhamachapaReturn = clintReqData.buttonPainding



  const handleCopy = () => {
    navigator.clipboard.writeText(clintReqData.accountnumber);
    alert("Account number copied to clipboard!");
  };


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
  

  const success = () => {
    update(ref(db, "ListOfRequest/" + clintReqData.key), {
      statuss: true,
      buttonDone: false,
      photo: Voucher,
      adminUID: Admin.uid,
      dateOf: formatDate(new Date()),


    });
    set(ref(db, "ListOfRequest/" + clintReqData.key + "/status"), {
      PIN: pinnumber,
    });
    next("/");
  };

  const PinNumber = (e) => {
    setpinnumber(e.target.value);
  };

  // just incase return

  // done by hand

  const [data, setData] = useState([]);
  const [userERbalance, setuserERbalance] = useState();
  const ReturnBL = () => {
    update(ref(db, "ListOfRequest/" + clintReqData.key), {

      buttonPainding: false,
      ReturnStatus: true,
    });

    set(ref(db, "ListOfRequest/" + clintReqData.key + "/status"), {
      PIN: pinnumber,
    });

    let bortomanBalance = userERbalance.balance;
    let returnBalance = clintReqData.amount;
    const ReturnBLn = Number(returnBalance);
    const UpdateReturnBalance = ReturnBLn + bortomanBalance;
    update(ref(db, "ClintList/" + clintReqData?.clintId), {
      balance: UpdateReturnBalance,
    });
    next("/");
  };

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

  // ====================

  useEffect(() => {
    data.map((item) => {
      if (item.key == clintReqData.clintId) {
        setuserERbalance(item);
      }
    });
  }, [data]);

  // done by hand

  // just incase return


  // uplode photos
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        setImage(base64String); // Save Base64 string to state
      };
      reader.onerror = (error) => {
        console.error("Error converting image to Base64:", error);
      };
      reader.readAsDataURL(file); // Converts file to Base64
    }
  };

  const [Voucher , setVoucher] = useState('')

  // Log the image Base64 string whenever it changes
  useEffect(() => {
    if (image) {
      setVoucher(image)
    }
  }, [image]);

  // uplode photos


  return (
    <div className="flex flex-col w-full h-screen">
      <Link to="/" className="w-full mt-5 text-white text-[30px]">
        <IoChevronBackOutline />{" "}
      </Link>
      <div className="backgraoundBlur w-full p-6 rounded-lg shadow-lg flex flex-col justify-end">
        <h2 className="text-2xl font-bold mb-4 text-white">Client Request</h2>

        <div className="flex items-center space-x-4 mb-4">
          <img
            src={clintReqData.clintPhoto}
            alt="Client"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-lg font-semibold text-white">
              {clintReqData.clintName}
            </h3>
          </div>
        </div>

        <div className="mb-4 text-white">

          {clintReqData.accountnumber &&
            (
              <p className="flex items-center space-x-2">
                <strong>Account No :</strong> {clintReqData.accountnumber}
                <button
                  onClick={handleCopy}
                  className="text-white hover:text-gray-300 ml-2"
                >
                  <FaRegCopy />
                </button>
              </p>
            )
          }

          {clintReqData.accounttype && (
            <p>
              <strong>Account Type:</strong> {clintReqData.accounttype}
            </p>
          )}
          <p>
            <strong>Amount:</strong> {clintReqData.amount}.TK
          </p>
          {clintReqData.type && (
            <p>
              <strong>Type:</strong> {clintReqData.type}
            </p>
          )}
          {clintReqData.bank && (
            <p>
              <strong>Bank:</strong> {clintReqData.bank}
            </p>
          )}
          {clintReqData.beneficiaryName && (
            <p>
              <strong>Beneficiary Name:</strong> {clintReqData.beneficiaryName}
            </p>
          )}
          {clintReqData.branch && (
            <p>
              <strong>Branch:</strong> {clintReqData.branch}
            </p>
          )}
          {clintReqData.district && (
            <p>
              <strong>District:</strong> {clintReqData.district}
            </p>
          )}



          {clintReqData.BLofGrameen && (
            <p>
              <strong>Oparetor:</strong> {clintReqData.BLofGrameen}
            </p>
          )}
          {clintReqData.Min && (
            <p>
              <strong>minute:</strong> {clintReqData.Min}
            </p>
          )}
          {clintReqData.NetOffer && (
            <p>
              <strong>Net:</strong> {clintReqData.NetOffer}
            </p>
          )}


          <p>
            <strong>Time:</strong> {clintReqData.time}
          </p>
          <p>
            <strong>Date:</strong> {clintReqData.dateOf}
          </p>




        </div>

        <div className="flex items-center space-x-4">
          <img
            src={clintReqData.photoOfmethod}
            alt="Method"
            className="w-10 h-10 rounded-full"
          />
          <p className="text-white">
            <strong>Method:</strong> {clintReqData.methodOf}
          </p>
        </div>

        {
          dhamachapa && <div className="w-full h-[40px] mt-5 flex ">
            <input
              onChange={PinNumber}
              className="amount outline-none w-full h-full rounded-xl text-black"
              type="text"
              placeholder="Write something before you complete"
            />

            {/* photo uplode */}
            <div className="w-full">
              <div className="flex flex-col items-center justify-center relative">
                <label
                  className="flex flex-col items-center text-[30px] justify-center text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-blue-600"
                  htmlFor="file-input"
                >
                  <IoMdPhotos />
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {image && (
                  <div className="w-[50px] h-[50px] border rounded-lg bg-white absolute bottom-[50px] left-[90px]">
                    <img
                      src={image}
                      alt="Uploaded Preview"
                      className="w-[50px] h-[50px] rounded-2xl overflow-hidden"
                    />
                  </div>
                )}
              </div>
            </div>
            {/* photo uplode */}


          </div>
        }

        <div className="w-full mt-[100px] flex justify-center gap-5 ">
          {/* {
            dhamachapaReturn && <button
              onClick={ReturnBL}
              className="bg-[#ff2663] px-9 py-3 font-bold rounded-xl active:scale-95 transition-all"
            >
              Return
            </button>
          } */}
          {
            dhamachapa && <button
              onClick={success}
              className="bg-[#19d32f] px-9 py-3 font-bold rounded-xl active:scale-95 transition-all"
            >
              Done
            </button>
          }
        </div>


      </div>
    </div>
  );
};

export default ClintRequest;
