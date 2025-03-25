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
import { getDatabase, ref, set, onValue, off, update } from "firebase/database";
import { MdHomeFilled, MdPendingActions } from "react-icons/md";
import { IoIosCloudDone } from "react-icons/io";
import { FaHistory, FaUsersCog } from "react-icons/fa";
import { clintData } from "../../Slice/SliceClint";
import UserNavbar from "../../Components/User navbar/UserNavbar";

const Home = () => {
  const clintInfo = useSelector((state) => state.info.userdata);
  const [one, tow] = useState(false);
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [allRequest, setAllRequest] = useState([]);
  const [requests, setRequests] = useState([]);
  const db = getDatabase();

  const auth = getAuth();

  const ProfileNext = () => tow(!one);

  const logout = () => {
    localStorage.clear();
    location.reload();
  };

  // Reauthenticate user
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

  // Set PIN in Firebase
  const handleSetPin = async () => {
    const isAuthenticated = await reauthenticateUser();
    if (isAuthenticated) {
      await set(ref(db, `ClintList/${auth.currentUser.uid}/pin`), pin);
      alert("PIN set successfully!");
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  // Fetch list of requests
  const fetchAllRequests = () => {
    const starCountRef = ref(db, "ListOfRequest/");
    onValue(starCountRef, (snapshot) => {
      const box = [];
      snapshot.forEach((item) => {
        box.push({ ...item.val(), key: item.key });
      });
      setAllRequest(box);
    });
  };

  useEffect(fetchAllRequests, []);

  // Function to fetch data from Firebase for notifications
  const fetchRequestsData = () => {
    const starCountRef = ref(db, "client_money_request/");
    onValue(starCountRef, (snapshot) => {
      const box = [];
      snapshot.forEach((paisa) => {
        box.push({ ...paisa.val(), key: paisa.key });
      });
      localStorage.setItem("requestsData", JSON.stringify(box));
      localStorage.setItem("requestsLastFetch", Date.now());
      setRequests(box);
      setHasNewRequests(box.length > 0);
    });
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("requestsData");
    const lastFetch = localStorage.getItem("requestsLastFetch");
    const ONE_MINUTE = 60 * 1000;

    if (cachedData && lastFetch && Date.now() - lastFetch < ONE_MINUTE) {
      setRequests(JSON.parse(cachedData));
      setHasNewRequests(JSON.parse(cachedData).length > 0);
    } else {
      fetchRequestsData();
    }
  }, [db]);

  // Navigate to next page with selected client data

  // notify
  const [allRequests, setAllRequests] = useState([]);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to send a browser notification
  const sendNotification = (title, body) => {
    if ("Notification" in window) {
      // Check if Notification API is supported
      if (Notification.permission === "granted") {
        new Notification(title, { body });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, { body });
          }
        });
      }
    } else {
      console.warn("Notification API is not supported on this device/browser.");
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Fetch data from Firebase, store it in localStorage, and check for updates
  const fetchAndUpdateData = () => {
    const dataRef = ref(db, "ListOfRequest/");
    onValue(dataRef, (snapshot) => {
      const fetchedData = [];
      snapshot.forEach((item) => {
        fetchedData.push({ ...item.val(), key: item.key });
      });

      const storedData = JSON.parse(localStorage.getItem("requestsData")) || [];
      const newData = fetchedData.filter(
        (item) => !storedData.some((stored) => stored.key === item.key)
      );

      // Update localStorage with the latest data
      localStorage.setItem("requestsData", JSON.stringify(fetchedData));

      // Update state with the fetched data
      setAllRequests(fetchedData);

      // Send notifications for new entries
      if (newData.length > 0) {
        newData.forEach((item) =>
          sendNotification("New Request Added", `Amount: ${item.amount} Tk`)
        );
        setHasNewRequests(true);
      } else {
        setHasNewRequests(false);
      }
    });
  };

  useEffect(() => {
    fetchAndUpdateData();

    // Clean up Firebase listeners on component unmount
    return () => {
      off(ref(db, "ListOfRequest/"));
    };
  }, [db]);

  // Navigate to client request details
  const nextPage = (dataofclintRequest) => {
    dispatch(clintData(dataofclintRequest));
    localStorage.setItem("clintDataStore", JSON.stringify(dataofclintRequest));
    navigate("/clintrequest");
  };

  // money request
  useEffect(() => {
    const clientMoneyRequestRef = ref(db, "client_money_request/");

    onValue(clientMoneyRequestRef, (snapshot) => {
      const newData = [];
      snapshot.forEach((item) => {
        newData.push({ ...item.val(), key: item.key });
      });

      // Retrieve stored data from localStorage
      const storedData =
        JSON.parse(localStorage.getItem("clientMoneyRequests")) || [];

      // Find new entries not already in localStorage
      const newEntries = newData.filter(
        (item) => !storedData.some((storedItem) => storedItem.key === item.key)
      );

      if (newEntries.length > 0) {
        // Update localStorage with the new data
        localStorage.setItem("clientMoneyRequests", JSON.stringify(newData));

        // Send notifications for new entries
        newEntries.forEach((entry) =>
          sendNotification("New Request", `Amount: ${entry.amount} Tk`)
        );
      }
    });

    // Cleanup listener on component unmount
    return () => off(clientMoneyRequestRef);
  }, [db]);

  // money request

  useEffect(() => {
    const clientMoneyRequestRef = ref(db, "client_money_request/");

    // Listen for changes in Firebase
    onValue(clientMoneyRequestRef, (snapshot) => {
      const fetchedData = [];
      snapshot.forEach((item) => {
        fetchedData.push({ ...item.val(), key: item.key });
      });

      // Get stored data from localStorage
      const storedData =
        JSON.parse(localStorage.getItem("clientMoneyRequests")) || [];

      // Identify new entries
      const newEntries = fetchedData.filter(
        (item) => !storedData.some((storedItem) => storedItem.key === item.key)
      );

      if (newEntries.length > 0) {
        // Update localStorage with new fetched data
        localStorage.setItem(
          "clientMoneyRequests",
          JSON.stringify(fetchedData)
        );

        // Send notifications for the new entries
        newEntries.forEach((entry) => {
          sendNotification("New Request", `Amount: ${entry.amount} Tk`);
        });
      }
    });

    // Cleanup listener on component unmount
    return () => off(clientMoneyRequestRef);
  }, [db]);

  // notify

  // user profile   ====================================================👈😑
  const [userProfile, setUserProfile] = useState(true);
  const flipUserState = () => {
    setUserProfile(!userProfile);
  };

  const [updateBlance, setUpdateBlance] = useState([]);

  const [updateOldBlance, setUpdatOldBlance] = useState([]);

  const OldBlanceForUpdate = updateOldBlance.balance;

  const ClintUID = updateOldBlance.uid;

  const RowBlance = OldBlanceForUpdate + Number(updateBlance);
  const RowmBlance = OldBlanceForUpdate - Number(updateBlance);

  const [newBalance, upnewBalance] = useState();

  const MinusBL = () => {
    upnewBalance(RowmBlance);
    SetTowUpdateBlance(!oneUpdateBlance);
  };
  const plusBL = () => {
    upnewBalance(RowBlance);
    SetTowUpdateBlance(!oneUpdateBlance);
  };

  const OnChangeBlance = (e) => {
    setUpdateBlance(e.target.value);
  };

  useEffect(() => {
    const clientRef = ref(db, "ClintList/" + ClintUID);

    const unsubscribe = onValue(clientRef, (snapshot) => {
      if (snapshot.exists()) {
        update(clientRef, {
          balance: newBalance,
        })
          .then(() => {
            console.log("Balance updated successfully!");
          })
          .catch((error) => {
            console.error("Error updating balance:", error);
          });
      } else {
        console.error("Client not found.");
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [ClintUID, newBalance]);

  const [oneUpdateBlance, SetTowUpdateBlance] = useState(true);

  const FuntionUpdateBlanceButton = (OldBlance) => {
    SetTowUpdateBlance(!oneUpdateBlance);
    setUpdatOldBlance(OldBlance);
  };

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "ClintList/");
    onValue(starCountRef, (snapshot) => {
      let box = [];
      snapshot.forEach((item) => {
        box.push({ ...item.val(), key: item.key });
        setUserData(box);
      });
    });
  }, []);
  // user profile

  return (
    <>
      <div className="homePage">
        <div className="w-full relative font-bold">
          {/* Navbar */}
          <UserNavbar />

          {/* Profile Page */}
          {one && (
            <div className="w-full h-screen bg-transparent ProfilePage absolute z-10">
              <div className="w-full mt-5 text-[30px]">
                <IoChevronBackOutline onClick={ProfileNext} />
              </div>
              <input
                className="w-full h-[40px] bg-[#1c1c1c68] rounded-full text-black pl-5 mt-20"
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
                className="w-full mt-2 bg-[#000000c6] text-white rounded-full py-2"
              >
                Set PIN
              </button>
              <div
                onClick={logout}
                className="flex items-center justify-center mt-20"
              >
                <div className="w-[140px] bg-[#00000038] text-white h-[40px] flex items-center gap-1 justify-center rounded-full font-bold">
                  <LuLogOut className="rotate-180" />
                  <button>Log Out</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="w-full h-[350px] md:h-[300px] overflow-y-scroll History py-10 px-2 md:px-5 lg:px-10 flex flex-wrap gap-5 mt-10">
          {allRequest.map((sob) => (
            <button
              key={sob.key}
              onClick={() => nextPage(sob)}
              className={`w-full text-[12px] md:text-[18px] h-[40px] border flex items-center justify-between p-3 rounded-xl ${
                sob.status ? "bg-[#16e21d4f]" : "bg-[#00000098]"
              } font-bold`}
            >
              <div className="w-10 h-10 rounded-xl opacity-60 overflow-hidden">
                <img
                  src={sob?.photoOfmethod}
                  alt="type"
                  className="w-10 h-10 rounded-md"
                />
              </div>
              <p>{sob?.amount}.Tk</p>
              <p>{sob?.accountnumber}</p>

              <p>{sob?.dateOf}</p>
            </button>
          ))}
        </div>

        <div className="w-full flex justify-end p-2 relative">
          <div
            onClick={flipUserState}
            className="w-[50px] h-[50px] bg-orange-200 rounded "
          ></div>

          {/* ==========================================😑👈 */}
          {userProfile && (
            <div className="w-full overflow-y-scroll bg-white h-[400px] absolute flex flex-wrap gap-1 bottom-[60px] right-0 rounded ">
              {userData.map((ox, unik) => (
                <div
                  key={unik}
                  className="w-full flex justify-between items-center px-4  h-[50px] bg-blue-500 rounded-full "
                >
                  <img
                    className="w-[50px]  rounded-full "
                    src={ox?.profile_picture}
                    alt=""
                  />
                  <p>{ox.username ? ox.username : "Name"}</p>

                  {oneUpdateBlance ? (
                    <p onClick={() => FuntionUpdateBlanceButton(ox)}>
                      {" "}
                      {ox?.balance}{" "}
                    </p>
                  ) : (
                    <div className="w-[80px] ">
                      <input
                        onChange={OnChangeBlance}
                        className=" w-full rounded-lg text-center text-[30px] "
                        type="number"
                      />
                      <div className="w-[80px] flex items-center justify-between absolute text-[40px] h-[40px] ">
                        <button
                          onClick={MinusBL}
                          className="text-[55px] active:scale-125 transition-all  "
                        >
                          -
                        </button>
                        <button
                          onClick={plusBL}
                          className=" active:scale-125 transition-all "
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-[#000000c6] flex items-center justify-between px-5 absolute w-full h-[40px] rounded-lg mt-4 bottom-4 hover:scale-95">
          <Link to="/" className="hover:scale-125">
            <MdHomeFilled className="text-white text-[30px]" />
          </Link>
          <Link to="/incomplete" className="hover:scale-125">
            <MdPendingActions className="text-white text-[30px]" />
          </Link>
          <Link to="/complete" className="hover:scale-125">
            <IoIosCloudDone className="text-white text-[30px]" />
          </Link>
          <Link to="/moneyrequest" className="relative hover:scale-125">
            <FaUsersCog className="text-white text-[30px]" />
            {hasNewRequests && (
              <span className="absolute top-0 right-0 bg-red-500 rounded-full h-2 w-2"></span>
            )}
          </Link>
          <Link to="/history" className="hover:scale-125">
            <FaHistory className="text-white text-[30px]" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
