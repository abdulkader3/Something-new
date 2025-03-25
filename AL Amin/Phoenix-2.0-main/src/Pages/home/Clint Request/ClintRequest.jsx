import React, { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Clintrequest.css";
import { getDatabase, onValue, ref, set, update } from "firebase/database";

const ClintRequest = () => {
  const clintReqData = useSelector((state) => state.infoclint.value);
  

  

  



 

  



  // just incase return

  // done by hand

  

 

  // ====================

 

  // done by hand

  // just incase return

  return (
    <div className="flex flex-col w-full h-screen">
      <Link to="/" className="w-full mt-5 text-white text-[30px]">
        <IoChevronBackOutline />{" "}
      </Link>
      <div className="backgraoundBlur w-full p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Client Request</h2>

        <div className="flex items-center space-x-4 mb-4">
          {/* <img
            src={clintReqData.clintPhoto}
            alt="Client"
            className="w-12 h-12 rounded-full"
          /> */}
          <div>
            {/* <h3 className="text-lg font-semibold text-white">
              {clintReqData.clintName}
            </h3> */}
          </div>
        </div>

        <div className="mb-4 text-white">
          <p className="flex items-center space-x-2">
            <strong>Account No :</strong> {clintReqData.accountnumber}
            <button
            //   onClick={handleCopy}
              className="text-white hover:text-gray-300 ml-2"
            >
              <FaRegCopy />
            </button>
          </p>
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

        <div className="w-full flex justify-center mt-5">
        <img
            src={clintReqData.photo}
            alt="Method"
            className="w-[120px]  "
          />
        </div>

        
       
      </div>
    </div>
  );
};

export default ClintRequest;
