import React, { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import "../../Styles/Home.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const DashboardHome = () => {
  const [about, setAbout] = useState("");
  const [ownerimg, setImg] = useState(null); // Will hold the file object

  const Create = async () => {
    console.log(secureLocalStorage.getItem("token"))
    try {
      const res = await axios.post(
        "http://localhost:1111/about",
        ownerimg,
        { about: about },
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAboutChange = (e) => {
    setAbout(e.target.value);
  };

  const handleImgChange = (e) => {
    // Set the selected file object
    if (e.target.files.length > 0) {
      setImg(e.target.files[0]);
    }
  };

  return (
    <>
      <Header />
      <div>
        {/* ... */}
        <div className="about">
          <section className="aboutContent">
            <h1>About us</h1>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit,
              voluptatum enim quidem dignissimos, cum alias magni laboriosam
              sequi soluta suscipit doloremque distinctio minima similique
              accusamus. Quaerat, magni! Molestias, similique aperiam?
            </p>
            <input type="text" onChange={handleAboutChange} value={about} />
            <input type="file" onChange={handleImgChange} />
          </section>
          <button onClick={Create}>Upload Image</button>
          {/* ... */}
        </div>
        {/* ... */}
      </div>
      <Footer />
    </>
  );
};

export default DashboardHome;
