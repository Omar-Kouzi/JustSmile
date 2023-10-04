import { useState, useEffect } from "react";
import "../Styles/Slideshow.css";
import axios from "axios";

function Slideshow() {
  const [slides, setSlides] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("https://justsmilebackend.onrender.com/slideshow");
        setSlides(res.data.all_Slides);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentImageIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentImageIndex, slides]);

  if (slides.length === 0) {
    return (
      <div className="NoSlide">
        <h2>No slide images available</h2>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => {
        return (
          <div key={index}>
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className={`carousel-image ${
                index === currentImageIndex ? "active" : ""
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Slideshow;
