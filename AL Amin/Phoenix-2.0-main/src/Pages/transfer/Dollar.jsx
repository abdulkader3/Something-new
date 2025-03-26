import React, { useEffect, useState } from "react";
import "./Transfer.css";
import UserNavbar from "../../Components/User navbar/UserNavbar";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, update, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const Dollar = () => {
    const [Offeers, setOffeers] = useState([]);
    const db = getDatabase();

    // Data of current user from Redux
    const ClintData = useSelector((state) => state.info.userdata);

    // Manage state
    const [category] = useState("5$ Dollar");
    const [categoryPhoto] = useState(
        "https://play-lh.googleusercontent.com/FxVO4tmAGRfxfbFqM2bumz5Y8FPwsymS1MJLAZ8UtM0DUKGywcBj7-LFZg6YNLRvGgtX"
    );
    const [account, setAccount] = useState(""); // Keep only this declaration
    const [paisa, setTaka] = useState(455);
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

    // Number of input
    const AccountNumber = (e) => {
        setAccount(e.target.value);
    };

    // Real-time clock
    function formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    // Format date
    const formatDate = (date) => {
        const month = date.getMonth() + 1; // Months are 0-indexed
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month < 10 ? "0" + month : month}/${day < 10 ? "0" + day : day}/${year}`;
    };

    const DATE = new Date();

    const goBack = useNavigate();
    const [data, setData] = useState([]);
    const [userERbalance, setuserERbalance] = useState();
    const bortomanBL = userERbalance?.balance;
    const newBALANCE = bortomanBL - paisa;

    const BkashSetData = () => {
        if (!account || account.length <= 12) {
            alert("আপনাকে নাম্বার দিতে হবে");
            return;
        }

        if (paisa > bortomanBL) {
            alert("Not sufficient balance");
            return;
        }

        if (security === securityFirebase.pin) {
            update(ref(db, "ClintList/" + ClintData.uid), {
                balance: newBALANCE,
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
                accountnumber: account,
                statuss: false,
                buttonDone: true,
                buttonPainding: true,
                ReturnStatus: false,
                ReturnStatusBG: true,
            });

            goBack("/");
        } else {
            alert("Wrong Pin");
        }
    };

    // Security
    useEffect(() => {
        const starCountRef = ref(db, "ClintList/" + ClintData.uid);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            setSecurityFirebase(data);
        });
    }, []);

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
        data.forEach((item) => {
            if (item.key === ClintData.uid) {
                setuserERbalance(item);
            }
        });
    }, [data]);

    return (
        <>
            <div className="transferMain text-white">
                <UserNavbar />
                <div className="px-2 md:px-[100px]">
                    <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-lg shadow-md w-full">
                        <h1 className="text-5xl font-bold text-center text-gray-800">$5</h1>
                        <h1 className="text-3xl font-bold text-center text-gray-800">455.BDT</h1>
                        <p className="mt-1 text-gray-600 text-center">Bangladesh -400mnts</p>
                    </div>

                    <div className="w-full mt-5 px-5 relative">
                        <input
                            onChange={AccountNumber}
                            className="border outline-none text-purple-700 amount pl-5 w-full h-[50px] rounded-md"
                            type="number"
                            placeholder="Number"
                        />
                        <p className="absolute top-3 right-10 text-[#32323288]"></p>
                    </div>

                    <div className="w-full mt-5">
                        <input
                            onChange={Pin}
                            className="pinPlace border outline-none text-purple-700 amount pl-5 w-full h-[50px] text-[45px] rounded-md"
                            type="number"
                            placeholder="  *    *    *    *   "
                        />
                    </div>

                    <button
                        onClick={BkashSetData}
                        className="w-full bg-white text-blue-700 mt-10 rounded-lg font-bold hover:scale-95 active:scale-100 transition-all py-4"
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
};

export default Dollar;
