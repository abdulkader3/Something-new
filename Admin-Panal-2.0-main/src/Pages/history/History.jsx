import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdHomeFilled, MdPendingActions } from "react-icons/md";
import { IoIosCloudDone } from "react-icons/io";
import { FaHistory, FaUsersCog } from "react-icons/fa";
import "./History.css";
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";

const History = () => {
  const AdminDataSlice = useSelector((state) => state.info.userdata);
  const db = getDatabase();

  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const starCountRef = ref(db, "AdminTlist/");
    onValue(starCountRef, (snapshot) => {
      const box = [];
      let amountSum = 0;

      snapshot.forEach((all) => {
        const data = all.val();
        box.push({ ...data, key: all.key });
        amountSum += data.Amount || 0;
      });

      setHistory(box);
      setFilteredHistory(box); // Initially show all data
      setTotalAmount(amountSum);
    });
  }, []);

  // Filter history by date and update the total amount
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    if (selectedDate) {
      // Filter the history based on the selected date
      const filteredData = history.filter(
        (item) => item.dateOf === selectedDate
      );

      // Calculate the total amount of the filtered data
      const filteredAmount = filteredData.reduce(
        (sum, item) => sum + (item.Amount || 0),
        0
      );

      setFilteredHistory(filteredData);
      setTotalAmount(filteredAmount);
    } else {
      // If no date is selected, show all data
      setFilteredHistory(history);
      const totalAllAmount = history.reduce(
        (sum, item) => sum + (item.Amount || 0),
        0
      );
      setTotalAmount(totalAllAmount);
    }
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center p-4 text-white min-h-screen">
        <div className="w-full">
          <Link to="/" className="w-full mt-5 text-white text-[30px]">
            <IoChevronBackOutline />
          </Link>
        </div>
        <h2 className="text-2xl font-semibold mb-4">History</h2>

        {/* Date Filter Input */}
        <input
          type="text"
          value={filterDate}
          onChange={handleDateChange}
          className="mb-4 p-2 rounded bg-gray-700 text-white"
          placeholder="মাস / তারিখ / বছর"
        />

        {/* Display Total Amount */}
        <h2 className="text-2xl font-semibold mb-4">
          Total Amount: {totalAmount} Tk
        </h2>

        {/* History List */}
        <div className="w-full h-full mb-[50px] rounded-lg overflow-y-scroll">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((request) => (
              <div
                key={request?.key}
                className="bg-gray-800 p-4 mb-4 rounded-md shadow-md"
              >
                <div className="flex items-center">
                  <p className="font-bold">{request?.ClintNAME}</p>
                </div>
                <p>
                  <strong>Amount: </strong>
                  {request?.Amount} Tk
                </p>
                <p>
                  <strong>Time: </strong>
                  {request?.Time}
                </p>
                <p>
                  <strong>Date: </strong>
                  {request?.dateOf}
                </p>
                {request?.TransactionID && (
                  <p>
                    <strong>Transaction ID: </strong>
                    {request.TransactionID}
                  </p>
                )}
                {request?.MethodOf && (
                  <p>
                    <strong>Method of Payment: </strong>
                    {request.MethodOf}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No history available for the selected date</p>
          )}
        </div>

        {/* Navigation Links */}
        <div className="bg-[#000000c6] flex items-center justify-between px-5 absolute w-full h-[40px] transition-all rounded-lg mt-4 bottom-4 md:bottom-6 lg:bottom-10 hover:scale-95">
          <Link to="/" className="hover:scale-125 active:scale-100 transition-all">
            <MdHomeFilled className="text-white text-[30px]" />
          </Link>
          <Link to="/incomplete" className="hover:scale-125 active:scale-100 transition-all">
            <MdPendingActions className="text-white text-[30px]" />
          </Link>
          <Link to="/complete" className="hover:scale-125 active:scale-100 transition-all">
            <IoIosCloudDone className="text-white text-[30px]" />
          </Link>
          <Link to="/moneyrequest" className="relative hover:scale-125 active:scale-100 transition-all">
            <FaUsersCog className="text-white text-[30px]" />
          </Link>
          <Link to="/history" className="hover:scale-125 active:scale-100 transition-all">
            <FaHistory className="text-white text-[30px]" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default History;
