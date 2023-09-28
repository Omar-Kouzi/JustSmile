import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/Item.css";
import { AiOutlineLink } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";

const Supplier = () => {
  const [supplier, setSupplier] = useState("");
  const supplierId = useParams();

  const fetchSupplier = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/barSuppliers/${supplierId.id}`
      );
      setSupplier(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchSupplier();
  }, [supplierId.id]);

  return (
    <>
      <Header />

      <div>
        {supplier ? (
          <div className="item">
            <img src={supplier.image} alt="item"  />
            <div className="itemContent">
              <h2>
                {supplier.title}
              </h2>
              <p>{supplier.description}</p>
              <p> {supplier.location}</p>
              <div className="barJuiceSuppliersIcons">
                {supplier.links.map((link, index) => (
                  <a key={index} href={link.link} title={link.title}>
                    {link.title}
                    <AiOutlineLink />
                  </a>
                ))}
                <a href={supplier.location} target="_blank">
                  <MdLocationPin />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading supplier data...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Supplier;
