import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/profile.css";
import { CSSTransition } from "react-transition-group";
import Loader from "../components/loader";

const Profile = () => {
  const [user, setUser] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    oldPassword: "",
    password: "",
    address: "",
    phoneNumber: "",
  });

  const [alert, setAlert] = useState("");
  const [valid, setValid] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const transitionRef = useRef(null);
  const userId = useParams();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/user/${userId.id}`
      );
      setUser(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleUserChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handlePatchUser = async () => {
    try {
      const res = await axios.patch(
        `https://justsmilebackend.onrender.com/user/`,
        {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          oldPassword: newUser.oldPassword,
          address: newUser.address,
          phoneNumber: newUser.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.message) {
        setUpdateSuccess(true);
        setValid(true);
        setAlert(res.data.message);
      } else {
        setUpdateSuccess(true);
        setValid(true);
        setAlert("User updated successfully");
      }
      fetchUser();
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        secureLocalStorage.removeItem("token");
        secureLocalStorage.removeItem("id");
        secureLocalStorage.setItem("loggedIn", false);
        window.location.reload();
      }
    }
  };
  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `https://justsmilebackend.onrender.com/user/${userId.id}`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };
  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
  };
  const fetchData = async () => {
    const startTime = Date.now();

    try {
      await Promise.all([fetchUser()]);
      const elapsedTime = Date.now() - startTime;
      const minimumDuration = 3000;

      if (elapsedTime < minimumDuration) {
        setTimeout(() => {
          setIsLoading(false);
        }, minimumDuration - elapsedTime);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    const loggedIn = secureLocalStorage.getItem("loggedIn");
    if (!token || !loggedIn === true) {
      navigate("/login");
    }
    fetchData();
    let timer;
    if (valid) {
      timer = setTimeout(() => {
        setValid(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [valid, userId.id]);

  return (
    <>
      <Header />
      {isLoading ? (
        <div className="LoaderWrapper">
          <Loader />
        </div>
      ) : (
        <div className="User">
          <div className="UserContent">
            {valid && (
              <i
                className={
                  updateSuccess
                    ? "SuccessMessageUserUpdate"
                    : "ErrorMessageUserUpdate"
                }
              >
                {alert}
              </i>
            )}
            <div>
              <h4>Username:</h4>{" "}
              <textarea
                onChange={handleUserChange}
                defaultValue={user.name}
                name="name"
              />
            </div>
            <div>
              <h4>Email:</h4>
              <textarea
                onChange={handleUserChange}
                defaultValue={user.email}
                name="email"
              />
            </div>
            <div>
              <h4>Old Password:</h4>
              <textarea
                type="text"
                onChange={handleUserChange}
                placeholder="Old Password"
                name="oldPassword"
              />
            </div>
            <div>
              <h4>New Password:</h4>
              <textarea
                type="text"
                onChange={handleUserChange}
                name="password"
                placeholder="New Password"
              />
            </div>
            <div>
              <h4>Address:</h4>
              <textarea
                onChange={handleUserChange}
                defaultValue={user.address}
                name="address"
              />
            </div>{" "}
            <div>
              <h4>Phone Number:</h4>
              <textarea
                onChange={handleUserChange}
                defaultValue={user.phoneNumber}
                name="phoneNumber"
              />
            </div>
            <button onClick={() => handlePatchUser()}>Update User</button>
            <button
              onClick={() => handleDeleteClick()}
              className="clearCartButton "
            >
              Delete User
            </button>
          </div>{" "}
          <CSSTransition
            in={showDeletePopup}
            timeout={300}
            classNames="deletePopup"
            unmountOnExit
            nodeRef={transitionRef} // Assign the ref here
          >
            <div className="deletePopup" ref={transitionRef}>
              <div className="deletePopupContent">
                <h3>Are you sure you want delete your account</h3>
                <div className="deletePopupButtonsContainer">
                  <button
                    className="deletePopupButtons yes"
                    onClick={handleDeleteUser}
                  >
                    Delete
                  </button>
                  <button
                    className="deletePopupButtons no"
                    onClick={handleDeleteCancel}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </CSSTransition>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Profile;
