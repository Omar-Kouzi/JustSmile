import { useState, useEffect } from "react";
import useToken from "../components/useToken";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import "../Styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [valid, setValid] = useState(false);
  const { setToken } = useToken();

  const navigate = useNavigate(); // Access the navigate function

  const loginUser = async (credentials) => {
    try {
      const res = await axios.post(
        `http://localhost:1111/user/login`,
        JSON.stringify(credentials),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setAlert(res.data.message);
      setValid(true);
      setLoginSuccess(res.data.success);

      if (res.data.success) {
        setToken(res.data.token);
        secureLocalStorage.setItem("loggedIn", true);
        secureLocalStorage.setItem("id", res.data.id);

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
      await loginUser({
        email,
        password,
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
    <div className="Login">
      <NavLink className="goback" to="/">
        {"<------"}
      </NavLink>
      <div className="Loginbox">
        <div className="Logotitle">
          <h1 className="Logintitle">Login</h1>
        </div>

        {valid && (
          <i
            className={
              loginSuccess ? "SuccessMessageLogin" : "ErrorMessageLogin"
            }
          >
            {alert}
          </i>
        )}
        <form action="#" className="LoginForm">
          <div className="LoginInputs">
            <div className="input-field">
              <p>Email</p>
              <input
                type="email"
                id="email"
                placeholder="email"
                className="Logininput"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-field">
              <p>Password</p>
              <input
                type="password"
                placeholder="password"
                className="Logininput"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="LoginButton-txt">
            <input
              type="submit"
              value="Login"
              className="btn solid LoginButton"
              onClick={handleSubmit}
            />
            <p>
              Create a new account?
              <NavLink to="/Signup" className="signupInLoginTxt">
                {" "}
                Signup.
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
