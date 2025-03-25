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
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { MdHomeFilled, MdPendingActions } from "react-icons/md";
import { IoIosCloudDone } from "react-icons/io";
import { FaHistory, FaUserClock, FaUsersCog } from "react-icons/fa";
import { clintData } from "../../Slice/SliceClint";

const Complete = () => {
  const clintInfo = useSelector((state) => state.info.userdata);
  const [one, tow] = useState(false);
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [allRequest, setAllRequest] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filterDate, setFilterDate] = useState("");

  // admin list
  const [adminlist, setAdminlist] = useState(false);
  const [list, setList] = useState([]);

  const [mapData, setMapData] = useState([]);

  const clintUid = clintInfo.uid;

  console.log(clintUid);

  const [uidforFilter, setUid] = useState(clintUid);

  console.log(uidforFilter);

  const ClickTouid = (update) => {
    setUid(update);
  };

  useEffect(() => {
    setMapData(list); // Use the entire list instead of overwriting
  }, [list]);
  

  const flipAdminList = () => {
    setAdminlist(!adminlist);
  };
  const flipwthBody = () => {
    setAdminlist(false);
  };

  useEffect(() => {
    const starCountRef = ref(db, "AdminList/");
    onValue(starCountRef, (snapshot) => {
      let box = [];
      snapshot.forEach((data) => {
        box.push({ ...data.val(), key: data.key });
      });
      setList(box);
    });
  }, []);

  // admin list

  // Toggle Profile section
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
      await set(ref(db, `ClintList/${auth.currentUser.uid}/pin`), pin);
      alert("PIN set successfully!");
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  // Fetching Firebase data
  // Fetching Firebase data
  useEffect(() => {
    const starCountRef = ref(db, "ListOfRequest/");
    onValue(starCountRef, (snapshot) => {
      let box = [];
      let amountSum = 0;

      snapshot.forEach((items) => {
        if (
          items.val().statuss === true &&
          items.val().adminUID == uidforFilter
        ) {
          box.push({ ...items.val(), key: items.key });

          // Convert the amount to a number before summing
          const amount = Number(items.val().amount) || 0;
          amountSum += amount;
        }
      });

      setAllRequest(box);
      setFilteredRequests(box); // Initially show all data
      setTotalAmount(amountSum); // Initial total amount
    });
  }, [db, uidforFilter]);

  // Handle date filtering
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    if (selectedDate) {
      const filteredData = allRequest.filter(
        (item) => item.dateOf === selectedDate
      );

      // Convert the amount to a number before summing
      const filteredAmount = filteredData.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
      );

      setFilteredRequests(filteredData);
      setTotalAmount(filteredAmount);
    } else {
      setFilteredRequests(allRequest);

      // Convert the amount to a number before summing
      const totalAllAmount = allRequest.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
      );

      setTotalAmount(totalAllAmount);
    }
  };

  // to the next page

  const nextPage = (dataofclintRequest) => {
    dispatch(clintData(dataofclintRequest));

    localStorage.setItem("clintDataStore", JSON.stringify(dataofclintRequest));

    navigate("/clintrequest");
  };
  // to the next page

  return (
    <>
      <div className="homePage">
        <div className="w-full relative font-bold">
          <div
            onClick={ProfileNext}
            className="homeNav w-full h-[60px] md:h-[100px] bg-white flex items-center justify-between p-5 md:p-10 lg:p-20"
          >
            <h2>{clintInfo?.displayName}</h2>
            <img
              className="w-[30px] md:w-[70px] lg:w-[100px] overflow-hidden rounded-full"
              src={clintInfo?.photoURL}
              alt="profile"
            />
          </div>

          {/* Profile Section */}
          {one && (
            <div className="w-full h-screen bg-transparent ProfilePage absolute z-10">
              <div className="w-full mt-5 text-[30px]">
                <IoChevronBackOutline onClick={ProfileNext} />
              </div>
              <input
                className="w-full h-[40px] bg-[#1c1c1c68] rounded-full text-black pl-5"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="w-full h-[40px] bg-[#1c1c1c68] rounded-full text-black pl-5 my-5"
                type="text"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button
                onClick={handleSetPin}
                className="w-full bg-[#000000c6] text-white rounded-full py-2"
              >
                Set PIN
              </button>
              <div
                onClick={logout}
                className="flex items-center justify-center"
              >
                <button className="w-[140px] bg-[#00000038] text-white h-[40px] font-bold rounded-full mt-20">
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter by Date */}
        <input
          type="text"
          value={filterDate}
          onChange={handleDateChange}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          placeholder="মাস / তারিখ / বছর"
        />
        <h2 className="text-2xl font-semibold mb-4">
          Total Amount: {totalAmount} Tk
        </h2>

        {/* Display filtered requests */}
        <div
          onClick={flipwthBody}
          className="w-full h-[300px] overflow-y-scroll History py-10"
        >
          {filteredRequests.map((sob) => (
            <button
              onClick={() => nextPage(sob)}
              key={sob.key}
              className={`w-full text-[12px] md:text-[18px] h-[40px] border flex items-center justify-between p-3 rounded-xl mb-4 ${
                sob.status ? "bg-[#16e21d4f]" : "bg-[#00000098]"
              }`}
            >
              <img
                className="w-10 h-10 rounded-md"
                src={sob?.photoOfmethod}
                alt="type"
              />
              <p>{sob?.amount} Tk</p>
              <p>{sob?.dateOf}</p>
              <p>{sob?.time}</p>
            </button>
          ))}
        </div>

        <div className="w-full flex justify-end p-2">
          <div className="w-full relative ">
            <FaUserClock
              onClick={flipAdminList}
              className="text-[30px] text-[#24fff0] ml-auto "
            />

            {adminlist && (
              <div className="w-full h-[100px] bg-[#ffffff94] rounded-xl absolute top-[-105px] overflow-y-scroll flex flex-wrap gap-5 ">
                {/* map admin list */}
   
                {/* error 404 */}
                {mapData.map((u) => (
                  <div
                    onClick={() => ClickTouid(u.key)}
                    key={u.key}
                    className="w-full h-[40px] bg-[#0000008e] rounded-xl flex gap-10 pl-2 items-center "
                  >
                    <img
                      className=" w-[30px] rounded-full overflow-hidden "
                      src={u?.profile_picture}
                      alt=""
                    />
                    <p> {u?.username} </p>
                  </div>
                ))}

                {/* map admin list */}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
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
            className="relative hover:scale-125 active:scale-100 transition-all"
          >
            <FaUsersCog className="text-white text-[30px]" />
          </Link>
          <Link
            to="/history"
            className="hover:scale-125 active:scale-100 transition-all"
          >
            <FaHistory className="text-white text-[30px]" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Complete;

