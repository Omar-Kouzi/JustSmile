import "../Styles/Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slideshow from "../components/Slidshow";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";
const Home = () => {
  const [about, setAbout] = useState([]);
  const [offers, setOffer] = useState([]);
  const [barSuppliers, setBarSuppliers] = useState([]);
  const [recommendeds, setRecommended] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAbout = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/about/650af04f7e27faca7127717b`
      );
      setAbout(response.data.about);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const fetchRecommended = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/recommended`
      );
      setRecommended(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const fetchBarSupplier = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/barSuppliers`
      );
      setBarSuppliers(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const fetchOffer = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/offer`
      );
      setOffer(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleShowMoreItem = (index) => {
    const ItemId = recommendeds[index]._id;
    navigate(`/items/${ItemId}`);
  };
  const handleShowMoreOffer = (index) => {
    const OfferId = offers[index]._id;
    navigate(`/offer/${OfferId}`);
  };
  const handleShowMoreSupplier = (index) => {
    const SupplierId = barSuppliers[index]._id;
    navigate(`/supplier/${SupplierId}`);
  };
  const fetchData = async () => {
    const startTime = Date.now();

    try {
      await Promise.all([
        fetchAbout(),
        fetchOffer(),
        fetchBarSupplier(),
        fetchRecommended(),
      ]);
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
    fetchData();
  }, []);

  return (
    <>
      <Header />
      {isLoading ? (
        <div className="LoaderWrapper">
          <Loader />
        </div>
      ) : (
        <div>
          <Slideshow />

          <div className="about">
            {" "}
            <section className="aboutContent">
              <h1>About us</h1>

              <p>{about.about} </p>
            </section>
            <section>
              <img src={about.image} className="aboutImage" alt="owner" />
            </section>
          </div>
          <div className="recommended">
            <h2>Our Recommendations </h2>
            <div className="mostRecommended">
              {recommendeds.map((recommended, index) => (
                <div key={index} className="recommendedCard">
                  <img
                    src={recommended.image}
                    alt={recommended.title}
                    className="recommendedImage"
                  />
                  <div className="recommendedContent">
                    <h4 className="recommendedName">{recommended.title}</h4>

                    <div>
                      <div
                        className="recommendedDescription"
                        id={`paragraph-${index}`}
                      >
                        {recommended.description}
                      </div>
                    </div>
                    <button
                      onClick={() => handleShowMoreItem(index)}
                      className="orderButton"
                    >
                      Show more
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="barJuiceSuppliers">
            <h2>Bar Juice Suppliers </h2>
            <div className="barJuiceSuppliersCarousel">
              {barSuppliers.map((supplier, index) => (
                <div key={index} className="barJuiceSuppliersCard">
                  <div className="barJuiceSuppliersContent">
                    <h4>{supplier.title}</h4>
                    <p>{supplier.description}</p>
                    <button onClick={() => handleShowMoreSupplier(index)}>
                      Show more
                    </button>
                  </div>

                  <img
                    src={supplier.image}
                    alt=""
                    className="barJuiceSuppliersImage"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="offers">
            <h2>Offers </h2>
            <div className="mostOffers">
              {offers.length > 0 ? (
                offers.map((offer, index) => (
                  <div key={index} className="offerCard">
                    <div className="offerContent">
                      <h2>{offer.title}</h2>
                      <p className="offerDiscription">{offer.description}</p>
                      <p>Just for the price of: {offer.price}$</p>
                      <button onClick={() => handleShowMoreOffer(index)}>
                        show more
                      </button>
                    </div>
                    <img src={offer.image} alt="" className="offerImage" />
                  </div>
                ))
              ) : (
                <div>
                  <p className="NoOffer">There aren't any Offers now</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Home;
