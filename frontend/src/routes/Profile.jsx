import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/profile.css";
import { CSSTransition } from "react-transition-group";

const Profile = () => {
  const [user, setUser] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    oldPassword: "",
    password: "",
    address: "",
    phoneNumber: "",
    image: null,
  });

  const [alert, setAlert] = useState("");
  const [valid, setValid] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const transitionRef = useRef(null);

  const userId = useParams();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1111/user/${userId.id}`
      );
      setUser(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleUserChange = (e) => {
    if (e.target.name === "image" && e.target.files.length > 0) {
      setNewUser({
        ...newUser,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setNewUser({
        ...newUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handlePatchUser = async () => {
    console.log(newUser);
    const formData = new FormData();
    formData.append("name", newUser.name || user.name);
    formData.append("email", newUser.email || user.email);
    formData.append("password", newUser.password || user.password);
    formData.append("oldPassword", newUser.oldPassword);
    formData.append("address", newUser.address || user.address);
    formData.append("phoneNumber", newUser.phoneNumber || user.phoneNumber);
    formData.append("image", newUser.image || user.image);
    formData.append("id", userId.id);

    try {
      const res = await axios.patch(`http://localhost:1111/user/`, formData, {
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchUser();

      if (res.data.message) {
        setUpdateSuccess(true);
        setValid(true);
        setAlert(res.data.message);
      } else {
        setUpdateSuccess(true);
        setValid(true);
        setAlert("Item updated successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteUser = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:1111/user/${userId.id}`,
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
  useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    const loggedIn = secureLocalStorage.getItem("loggedIn");
    if (!token || !loggedIn === true) {
      navigate("/login");
    }
    fetchUser();
    let timer;
    if (valid) {
      timer = setTimeout(() => {
        setValid(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [valid, userId.id]);

  return (
    <>
      <Header />

      <div>
        {user ? (
          <div className="User">
            <div>
              <img src={user.image} alt="User" />
              <input type="file" onChange={handleUserChange} />
            </div>
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
                <h3>Username:</h3>{" "}
                <textarea
                  onChange={handleUserChange}
                  defaultValue={user.name}
                  name="name"
                />
              </div>
              <div>
                <h3>Email:</h3>
                <textarea
                  onChange={handleUserChange}
                  defaultValue={user.email}
                  name="email"
                />
              </div>
              <div>
                <h3>Old Password:</h3>
                <textarea
                  type="text"
                  onChange={handleUserChange}
                  placeholder="Old Password"
                  name="oldPassword"
                />
              </div>
              <div>
                <h3>New Password:</h3>
                <textarea
                  type="text"
                  onChange={handleUserChange}
                  name="password"
                  placeholder="New Password"
                />
              </div>
              <div>
                <h3>Address:</h3>
                <textarea
                  onChange={handleUserChange}
                  defaultValue={user.address}
                  name="address"
                />
              </div>{" "}
              <div>
                <h3>Phone Number:</h3>
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
                  <h1>Are you sure you want delete your account</h1>
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
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
