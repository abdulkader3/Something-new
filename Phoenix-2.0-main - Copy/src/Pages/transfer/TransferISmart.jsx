import React from "react";
import "./Transfer.css";
import UserNavbar from "../../Components/User navbar/UserNavbar";
import { Link } from "react-router-dom";

const TransferISmart = () => {
  return (
    <>
      <div className=" transferMain text-white ">
        <UserNavbar />
        <div className="px-2 md:px-[100px]">
          <div className="w-full flex justify-between items-center mt-10 px-3 ">
            <div className="w-[150px] relative  ">
              <input
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
                src="https://play-lh.googleusercontent.com/HMzdrJUMVF1ssfIjsX5kDZ2zQmTJCeyHEZVASXC6aAMZsp-WX2AXP6RECh1x_L44-eI"
                alt="option"
              />{" "}
              iSmart{" "}
            </Link>
          </div>

          {/* name list */}

          <p className="font-bold mt-10">Beneficiary Name :</p>

          <div className=" w-full h-[50px] rounded-2xl border  overflow-x-scroll  mt-2 ">
            <input
              className="w-full h-full outline-none text-black"
              type="text"
            />
          </div>

          {/* name list */}
          {/* bank list */}

          <p className="font-bold mt-2">Bank :</p>

          <div className=" w-full h-[50px] rounded-2xl border  overflow-x-scroll  mt-2 ">
            <input
              className="w-full h-full outline-none text-black"
              type="text"
            />
          </div>

          {/* bank list */}

          {/* city list */}
          <p className="font-bold mt-2">District :</p>
          <div className=" w-full h-[50px] rounded-2xl border  overflow-x-scroll mt-2  ">
            <input
              className="w-full h-full outline-none text-black"
              type="text"
            />
          </div>
          {/* city list */}

          {/* branch list */}
          <p className="font-bold mt-2">Branch :</p>
          <div className=" w-full h-[50px] rounded-2xl border  overflow-x-scroll mt-2  ">
            <input
              className="w-full h-full outline-none text-black"
              type="text"
            />
          </div>
          {/* branch list */}

          <div className="w-full mt-5 px-5 relative ">
            <input
              className=" border outline-none text-purple-700 amount pl-5 w-full h-[50px]  rounded-md "
              type="number"
              placeholder="A/C"
            />
            <p className=" absolute top-3 right-10 text-[#32323288] "> Number </p>
          </div>

          <div className=" w-full mt-10 ">
            <input
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

          

         

          <button className=" w-full bg-white text-blue-700 mt-10 rounded-lg font-bold hover:scale-95 active:scale-100 transition-all py-4 ">
            {" "}
            Send{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default TransferISmart;
