import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Bounce, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { userData } from "../../Slice/SliceUser";
import { getDatabase, ref, set, update } from "firebase/database";
import { get, child } from "firebase/database"; // Import `get` and `child` for reading data



const Login = () => {
  
  const [email, setemail] = useState("");
  const [emailErorr, setemailErorr] = useState("");
  const [password, setpassword] = useState("");
  const [passwordErorr, setpasswordErorr] = useState("");

  // data from redux
  const dispatch = useDispatch()


  // Enhancing performance

  const emailOnchang = (e) => {
    setemail(e.target.value);
    setemailErorr("");
  };
  const passwordOnchang = (e) => {
    setpassword(e.target.value);
    setpasswordErorr("");
  };
  const confirmOnchang = (e) => {
    setconfirm(e.target.value);
    setconfirmErorr("");
  };

  // firebase
  const auth = getAuth();
  const db = getDatabase();

  // logic
  const navigate = useNavigate()

  // ===submit form Validation logic
const submit = (e) => {
  e.preventDefault();

  if (!email) {
    setemailErorr("Please enter your email");
  } else if (!password) {
    setpasswordErorr("Please enter your password");
  } else {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch(userData(user));
        localStorage.setItem("ClintInfo", JSON.stringify(user));

        if (!user.emailVerified) {
          toast("Please verify your email", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        } else {
          toast("Login success", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
          navigate("/");

          // Reference to user data in the database
          const userRef = ref(db, "ClintList/" + user.uid);

          // Check if user data already exists
          get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
              console.log("User data already exists. Skipping update.");
            } else {
              console.log("User data does not exist. Updating...");
              // Update user data in Firebase
              update(userRef, {
                username: user.displayName,
                email: user.email,
                profile_picture: user.photoURL,
                uid: user.uid,
              });
            }
          }).catch((error) => {
            console.error("Error checking user data: ", error);
          });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-credential") {
          toast("Email or Password Error", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        }
      });
  }
};


  return (
    <>
      <div className="registrationPage ">
        <h1 className=" my-[30px] font-bold text-4xl text-white "> Login </h1>

        <form
          onSubmit={submit}
          className="registrationForm w-full  px-[10px] flex flex-col items-center "
        >
          <div className=" w-full mt-10 mb-4 ">
            <p>Email</p>
            <input
              onChange={emailOnchang}
              className="w-full bg-transparent outline-none h-[40px] border-[3px] rounded-xl my-3 pl-[20px] "
              type="email"
              name=""
              id=""
              placeholder="user email"
            />
          </div>

          <div className=" w-full text-red-400">
            <p> {emailErorr} </p>
          </div>

          <div className=" w-full mb-5 ">
            <p>Password</p>
            <input
              onChange={passwordOnchang}
              className="w-full bg-transparent outline-none h-[40px] border-[3px] rounded-xl my-3 pl-[20px] "
              type="password"
              name=""
              id=""
              placeholder="password"
            />
          </div>

          <div className=" w-full text-red-400">
            <p>{passwordErorr} </p>
          </div>

          <br />

          <button className="w-full bg-transparent h-[40px] border-[3px] rounded-xl my-3 pl-[20px] hover:scale-95 active:scale-100 transition-all ">
            {" "}
            Login{" "}
          </button>

          <Link className="mb-5 mt-10" to="/registration">
            {" "}
            Don't have an account ? Register{" "}
          </Link>
        </form>
      </div>
    </>
  );
};

export default Login;
