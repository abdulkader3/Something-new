import React, { useState } from "react";
import "./Registration.css";
import { Link, useNavigate } from "react-router-dom";
// frirebase
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { Bounce, toast } from "react-toastify";

const Registration = () => {
  // ===Use state for validation
  const [name, setname] = useState("");
  const [nameErorr, setnameErorr] = useState("");
  const [email, setemail] = useState("");
  const [emailErorr, setemailErorr] = useState("");
  const [password, setpassword] = useState("");
  const [passwordErorr, setpasswordErorr] = useState("");
  const [confirm, setconfirm] = useState("");
  const [confirmErorr, setconfirmErorr] = useState("");

  // Enhancing performance

  const nameOnchang = (e) => {
    setname(e.target.value);
    setnameErorr("");
  };
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

  // logic
  const navigate = useNavigate("");

  // firebase
  const auth = getAuth();

  // ===submit form Validation logic
  const submit = (e) => {
    e.preventDefault();

    if (!name) {
      setnameErorr("Please enter your name");
    } else if (!email) {
      setemailErorr("Please enter your email");
    } else if (!password) {
      setpasswordErorr("Please enter your password");
    } else if (!confirm) {
      setconfirmErorr("Please confirm your password");
    } else {
      if (password !== confirm) {
        toast('Confirm password incorrect', {
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
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log( 'top',  user  );

            updateProfile(auth.currentUser, {
              displayName: name,
              photoURL: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            });
            sendEmailVerification(auth.currentUser).then(() => {
              // Email verification sent!
              // ...
            });
            navigate("/login");
            toast('Register success verification mail sent', {
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

              console.log('buttom' ,user);

            
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;

            if(errorCode == 'auth/email-already-in-use'){
              toast('Email already in use !', {
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

            console.log(errorCode);
            // ..
          });
      }
    }
  };
  return (
    <>
      <div className="registrationPage ">
        <h1 className=" my-3 md:my-[30px] font-bold text-4xl text-white ">
          {" "}
          Registration{" "}
        </h1>

        <form
          onSubmit={submit}
          className="registrationForm w-full   p-[10px] flex flex-col items-center "
        >
          <div className=" w-full ">
            <p>Name</p>
            <input
              onChange={nameOnchang}
              className="w-full bg-transparent outline-none h-[40px] border-[3px] rounded-xl my-3 pl-[20px] "
              type="text"
              name=""
              id=""
              placeholder="user name"
            />
          </div>

          <div className=" w-full text-red-400">
            <p>{nameErorr} </p>
          </div>

          <div className=" w-full ">
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

          <div className=" w-full ">
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

          <div className=" w-full ">
            <p>Confirm password</p>
            <input
              onChange={confirmOnchang}
              className="w-full bg-transparent outline-none h-[40px] border-[3px] rounded-xl my-3 pl-[20px] "
              type="password"
              name=""
              id=""
              placeholder="Confirm password"
            />
          </div>

          <div className=" w-full text-red-400">
            <p>{confirmErorr} </p>
          </div>

          <br />

          <button className="w-full bg-transparent h-[40px] border-[3px] rounded-xl my-3 pl-[20px] hover:scale-95 active:scale-100 transition-all ">
            {" "}
            Register{" "}
          </button>

          <Link to="/login"> Already have an account ? Login </Link>
        </form>
      </div>
    </>
  );
};

export default Registration;
