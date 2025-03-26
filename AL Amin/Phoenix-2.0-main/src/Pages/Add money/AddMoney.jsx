import React, { useState } from 'react';
import UserNavbar from '../../Components/User navbar/UserNavbar';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { getDatabase, push, ref, set } from 'firebase/database';
import { useSelector } from 'react-redux';

const AddMoney = () => {
  const currentUser = useSelector((state) => state.info.userdata);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  // Format time in AM/PM
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
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
  
  // Now use the formatDate function to log the formatted date
  console.log(formatDate(DATE));  // This will show the date in the MM/DD/YYYY format
  
  // date 

  // Function to handle form submission
  const handleRequest = async () => {
    if (!amount || !message) {
      alert('Please enter an amount and a message.');
      return;
    }

    const db = getDatabase();
    const requestRef = push(ref(db, 'client_money_request/')); 


    try {
      await set(requestRef, {
        Amount: Number(amount),
        Message: message,
        Time: formatAMPM(new Date()),
        dateOf: formatDate(new Date()),
        ClintUID: currentUser.uid,
        ClintNAME: currentUser.displayName,
        ClintPHOTO: currentUser.photoURL,
      });
      alert('টাকার জন্য অনুরোধ সফল হয়েছে');
      setAmount('');
      setMessage('');
    } catch (error) {
      alert('Error sending request: ' + error.message);
    }
  };

  return (
    <div className="w-full h-screen ">
      <UserNavbar />
      <div className="w-full my-5 flex items-center px-4">
        <Link to="/">
          <IoIosArrowBack className="text-white text-2xl" />
        </Link>
      </div>

      <div className="w-full text-white gap-5 flex flex-col items-center px-4">
        <h2 className="text-2xl font-semibold mb-4">Request for Money</h2>

        <input
          className="text-black px-4 py-2 w-full max-w-md rounded-md focus:outline-none"
          placeholder="Enter amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="w-full max-w-md h-36 bg-gray-800 rounded-xl mt-6">
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            className="w-full h-full p-4 text-white bg-transparent border-2 border-gray-600 rounded-xl resize-none outline-none"
            placeholder="Enter your message"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleRequest}
          className="bg-[#00000094]  px-5 py-2 rounded-md mt-4 text-white font-medium transition active:scale-95"
        >
          Send the Request
        </button>
      </div>
    </div>
  );
};

export default AddMoney;
