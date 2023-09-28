import React, { useState, useEffect } from "react";
import useToken from "../components/useToken";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import "../Styles/Signup.css";
import { AiOutlineHome } from "react-icons/ai";

// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet-search";
// import L from "leaflet";

// function AddressMap({ setAddress }) {
//   const [position, setPosition] = useState(null);

//   // Initialize the search control outside
//   const searchControl = L.control.search({
//     position: "topleft",
//     initial: false,
//     zoom: 12,
//     marker: false,
//     textPlaceholder: "Search for an address",
//     moveToLocation: (latlng, title, map) => {
//       map.setView(latlng, 16);
//       setPosition(latlng);
//     },
//   });

//   const mapRef = useRef();

//   const handleMapClick = (e) => {
//     setPosition(e.latlng);
//   };

//   const handleMarkerDragEnd = (e) => {
//     console.log(e);
//     // const latlng = e.target.getLatLng();
//     // setPosition(e.target.getLatLng());
//     // setAddress({ lat: latlng.lat, lng: latlng.lng });
//   };

//   useMapEvents({
//     click: handleMapClick,
//   });

//   useEffect(() => {
//     // Add the search control to the map when it's ready
//     if (mapRef.current && searchControl) {
//       searchControl.addTo(mapRef.current);
//     }
//   }, [searchControl]);
//   return (
//     <>
//       {position && (
//         <Marker
//           position={position}
//           draggable={true}
//           eventHandlers={console.log(position)}
//         />
//       )}
//     </>
//   );
// }
// {/* <MapContainer
//   center={[33.855598, 35.507977]}
//   zoom={13}
//   style={{ height: "300px", width: "100%" }}
// >
//   <TileLayer
//     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//   />
//   <AddressMap setAddress={setAddress} />
// </MapContainer>; */}

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState(null);
  const [image, setImage] = useState("");
  const [alert, setAlert] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [valid, setValid] = useState(false);
  const { setToken } = useToken();
  const navigate = useNavigate();

  const SignUpUser = async (credentials) => {
    try {
      const res = await axios.post(
        `http://localhost:1111/user/`,
        JSON.stringify(credentials),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setAlert(res.data.message);
      setValid(true);
      setSignUpSuccess(res.data.success);
      if (res.data.success) {
        setToken(res.data.token);
        secureLocalStorage.setItem("loggedIn", true);
        secureLocalStorage.setItem("id", res.data.user._id);

        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        secureLocalStorage.setItem("loggedIn", false);
      }
    } catch (error) {
      console.log("Error:", error);
      setAlert(error.message);
      setValid(true);
      secureLocalStorage.setItem("loggedIn", false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await SignUpUser({
        name,
        email,
        password,
        address: address ? `${address.lat},${address.lng}` : "",
        image,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let timer;
    if (valid) {
      timer = setTimeout(() => {
        setValid(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [valid]);

  return (
    <div className="Signup">
      <NavLink to="/" className="goback">
        <AiOutlineHome />
      </NavLink>
      <div className="Signupbox">
        <div className="Logotitle">
          <h1 className="Signuptitle">Sign Up</h1>
        </div>

        {valid && (
          <i
            className={
              signUpSuccess ? "SuccessMessageSignup" : "ErrorMessageSignup"
            }
          >
            {alert}
          </i>
        )}
        <form action="#" className="SignupForm">
          <div className="SignupInputs">
            <div className="input-field">
              <p>Name</p>
              <input
                type="text"
                id="name"
                placeholder="name"
                onChange={(e) => setName(e.target.value)}
                className="Signupinput"
              />
            </div>
            <div className="input-field">
              <p>Email</p>
              <input
                type="email"
                id="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                className="Signupinput"
              />
            </div>
            <div className="input-field">
              <p>Password</p>
              <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                className="Signupinput"
              />
            </div>
            <div className="input-field">
              <p>Address</p>
              <input
                type="text"
                placeholder="address"
                onChange={(e) => setAddress(e.target.value)}
                className="Signupinput"
              />
            </div>
            <div className="input-field">
              <p>Image</p>
              <input
                type="file"
                placeholder="image"
                onChange={(e) => setImage(e.target.value)}
                className="Signupinput"
              />
            </div>
          </div>
          <div className="SignupButton-txt">
            <input
              type="submit"
              value="Sign Up"
              onClick={handleSubmit}
              className="btn solid SignupButton"
            />
            <p>
              Already have an account?
              <NavLink to="/login" className="signupInSignupTxt">
                {" "}
                Login.
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
