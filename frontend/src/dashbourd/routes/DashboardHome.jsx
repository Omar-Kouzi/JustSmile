import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import "../dashbaordStyles/DahboardHome.css";
import Header from "../../components/Header";
import DashboardHeader from "../components/DashbaordHeader";
import Footer from "../../components/Footer";
import Loader from "../../components/loader";

const DashboardHome = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [about, setAbout] = useState("");
  const [newAbout, setNewAbout] = useState(about.about);
  const [aboutImg, setImg] = useState("");

  const [recommendeds, setRecommended] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const filteredItems = items.filter((item) => item.available);

  const navigate = useNavigate();

  const [barSuppliers, setBarSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    title: "",
    description: "",
    location: "",
    links: [],
    image: null,
  });

  const [offers, setOffer] = useState([]);
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    price: "",
    size: "offer",
    image: null,
  });

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
  const UpdateAbout = async () => {
    try {
      await axios.patch(
        "https://justsmilebackend.onrender.com/about/650af04f7e27faca7127717b",
        { about: newAbout, image: aboutImg },
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );
      fetchAbout();
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

  const handleAboutChange = (e) => {
    setNewAbout(e.target.value);
  };

  const handleImgChange = (e) => {
    if (e.target.files.length > 0) {
      setImg(e.target.files[0]);
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

  const handleItemClick = (index) => {
    const ItemId = recommendeds[index]._id;
    navigate(`/dashboard/items/${ItemId}`);
  };
  const deleteRecommended = async (id) => {
    try {
      await axios.delete(
        `https://justsmilebackend.onrender.com/recommended/${id}`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );
      fetchRecommended();
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const handleDeleteRecommended = (index) => {
    const id = recommendeds[index]._id;
    deleteRecommended(id);
  };
  const handlePostRecommended = async () => {
    try {
      await axios.post(
        "https://justsmilebackend.onrender.com/recommended",
        { id: selectedItem },
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );
      fetchRecommended();
    } catch (error) {
      if (error.response.status === 401) {
        secureLocalStorage.removeItem("token");
        secureLocalStorage.removeItem("id");
        secureLocalStorage.setItem("loggedIn", false);
        window.location.reload();
      }
      console.error(error);
    }
  };
  const fetchItems = async () => {
    try {
      const response = await axios.get(
        "https://justsmilebackend.onrender.com/items"
      );
      setItems(response.data);
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

  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(
        `https://justsmilebackend.onrender.com/barSuppliers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchBarSupplier();
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleSupplierChange = (e) => {
    if (e.target.name === "image" && e.target.files.length > 0) {
      setNewSupplier({
        ...newSupplier,
        image: e.target.files[0],
      });
    } else {
      const { name, value } = e.target;
      setNewSupplier({
        ...newSupplier,
        [name]: value,
      });
    }
  };

  const handlePostSupplier = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newSupplier.title);
    formData.append("description", newSupplier.description);
    formData.append("location", newSupplier.location);
    formData.append("links", newSupplier.links);
    formData.append("image", newSupplier.image);

    try {
      await axios.post(
        "https://justsmilebackend.onrender.com/barSuppliers/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchBarSupplier();
    } catch (error) {
      if (error.response.status === 401) {
        secureLocalStorage.removeItem("token");
        secureLocalStorage.removeItem("id");
        secureLocalStorage.setItem("loggedIn", false);
        window.location.reload();
      }
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

  const handleDeleteOffer = async (id) => {
    try {
      await axios.delete(`https://justsmilebackend.onrender.com/offer/${id}`, {
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
        },
      });
      fetchOffer();
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleOfferChange = (e) => {
    if (e.target.name === "image" && e.target.files.length > 0) {
      setNewOffer({
        ...newOffer,
        image: e.target.files[0],
      });
    } else {
      const { name, value } = e.target;
      setNewOffer({
        ...newOffer,
        [name]: value,
      });
    }
  };
  const handlePostOffer = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newOffer.title);
    formData.append("description", newOffer.description);
    formData.append("price", newOffer.price);
    formData.append("image", newOffer.image);
    formData.append("size", newOffer.size);
    try {
      await axios.post(
        "https://justsmilebackend.onrender.com/offer/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchOffer();
    } catch (error) {
      if (error.response.status === 401) {
        secureLocalStorage.removeItem("token");
        secureLocalStorage.removeItem("id");
        secureLocalStorage.setItem("loggedIn", false);
        window.location.reload();
      }
      console.log("Error fetching data:", error);
    }
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
        fetchItems(),
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
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Header />
      <DashboardHeader />
      {isLoading ? (
        <div className="LoaderWrapper">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="about">
            <section className="aboutContent">
              <h1>About us</h1>
              <textarea
                type="text"
                onChange={handleAboutChange}
                defaultValue={about.about}
                className="aboutdashboardtext"
              ></textarea>
              <button onClick={UpdateAbout}>Update About</button>
            </section>{" "}
            <div className="aboutdashboardimage">
              <img src={about.image} alt="" width="200px" />
              <input type="file" onChange={handleImgChange} />
            </div>
          </div>
          <div className="recommended">
            <h2>Our Recommendations </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePostRecommended();
              }}
              className="recommendedDashboardForm"
            >
              <select
                id="itemSelect"
                name="item"
                onChange={(e) => setSelectedItem(e.target.value)}
                value={selectedItem}
              >
                <option value="">Select an item</option>
                {filteredItems.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <button type="submit">Create Recommended</button>
            </form>

            <div className="mostRecommended">
              {recommendeds.map((recommended, index) => (
                <div key={index} className="recommendedCard">
                  <div>
                    <img
                      src={recommended.image}
                      alt={recommended.title}
                      className="recommendedImage"
                    />{" "}
                  </div>
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
                      onClick={() => handleItemClick(index)}
                      className="orderButton"
                    >
                      Show more
                    </button>{" "}
                    <button
                      onClick={() => handleDeleteRecommended(index)}
                      className="recommendedDeleteButton"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="barJuiceSuppliers dashboardSuplier">
            <h2>We Supply</h2>
            <form action="#" className="barJuiceSupplierForm">
              <div className="barJuiceSupplierFormInputs">
                <div className="barJuiceSupplierFormInput-field">
                  <p>Title</p>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="title"
                    onChange={(e) => {
                      handleSupplierChange(e);
                    }}
                  />
                </div>
                <div className="barJuiceSupplierFormInput-field">
                  <p>Description</p>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="description"
                    onChange={(e) => {
                      handleSupplierChange(e);
                    }}
                  />
                </div>
                <div className="barJuiceSupplierFormInput-field">
                  <p>Location</p>
                  <input
                    type="text"
                    placeholder="location"
                    name="location"
                    onChange={(e) => {
                      handleSupplierChange(e);
                    }}
                  />
                </div>
                <div className="barJuiceSupplierFormInput-field">
                  <p>Links</p>
                  <textarea
                    type="text"
                    placeholder={`Example for how to input the [{ "title": "Link 1 Title",
                  "link": "Link 1 URL" },{ "title": "Link 2 Title",
                  "link": "Link 2 URL" },{ "title": "Link 3 Title",
                  "link": "Link 3 URL" } ]`}
                    name="links"
                    onChange={(e) => {
                      handleSupplierChange(e);
                    }}
                  />
                  <p className="barJuiceSupplierFormExample">
                    Example for how to input the &#91; &#123; "title": "Link 1
                    Title", "link": "Link 1 URL" &#125;, &#123; "title": "Link 2
                    Title", "link": "Link 2 URL" &#125;, &#123; "title": "Link 3
                    Title", "link": "Link 3 URL" &#125; &#93;
                  </p>
                </div>
                <div className="barJuiceSupplierFormInput-field">
                  <p>Image</p>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={(e) => {
                      handleSupplierChange(e);
                    }}
                  />
                </div>
              </div>
              <div className="barJuiceSupplierFormInput-Submitfield ">
                <input
                  type="submit"
                  value="Post a Supplier"
                  onClick={(e) => handlePostSupplier(e)}
                />
              </div>
            </form>
            <div className="recommended">
              <h2>We Supply </h2>
              <div className="mostRecommended">
                {barSuppliers.map((supplier, index) => (
                  <div key={index} className="recommendedCard">
                    <img
                      src={supplier.image}
                      alt=""
                      className="recommendedImage"
                    />
                    <div className="recommendedContent">
                      <h4 className="recommendedName">{supplier.title}</h4>
                      <div
                        className="recommendedDescription"
                        id={`paragraph-${index}`}
                      >
                        {supplier.description}
                      </div>
                      <button
                        onClick={() => handleShowMoreSupplier(index)}
                        className="orderButton"
                      >
                        Show more
                      </button>
                      <button
                        className="recommendedDeleteButton"
                        onClick={() => handleDeleteSupplier(supplier._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="offers dashboardOffers">
            <h2>Offers </h2>{" "}
            <form action="#" className="barJuiceSupplierForm">
              <div className="offerFormInputs">
                <div className="barJuiceSupplierFormInput-field">
                  <p>Title</p>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="title"
                    onChange={(e) => {
                      handleOfferChange(e);
                    }}
                  />
                </div>
                <div className="barJuiceSupplierFormInput-field">
                  <p>Description</p>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="description"
                    onChange={(e) => {
                      handleOfferChange(e);
                    }}
                  />
                </div>
                <div className="barJuiceSupplierFormInput-field">
                  <p>Price</p>
                  <input
                    type="text"
                    placeholder="price"
                    name="price"
                    onChange={(e) => {
                      handleOfferChange(e);
                    }}
                  />
                </div>
                <div className="barJuiceSupplierFormInput-field">
                  <p>Image</p>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={(e) => {
                      handleOfferChange(e);
                    }}
                  />
                </div>
              </div>
              <div className="  ">
                <input
                  type="submit"
                  value="Post a Supplier"
                  onClick={(e) => handlePostOffer(e)}
                />
              </div>
            </form>
            <div className="mostOffers">
              {offers.map((offer, index) => (
                <div key={index} className="offerCard">
                  <div className="offerContent">
                    <h2>{offer.title}</h2>
                    <p className="offerDiscription">{offer.description}</p>
                    <p>Just for the price of: {offer.sizePrice[0].price}$</p>

                    <button onClick={() => handleShowMoreOffer(index)}>
                      show more
                    </button>
                    <button
                      className="recommendedDeleteButton"
                      onClick={() => handleDeleteOffer(offer._id)}
                    >
                      Delete
                    </button>
                  </div>
                  <img src={offer.image} alt="" className="offerImage" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default DashboardHome;
