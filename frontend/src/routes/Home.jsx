import "../Styles/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <div>
        <div className="carousel"></div>
        <div className="about">
          <section className="aboutContent">
            <h1>About us</h1>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit,
              voluptatum enim quidem dignissimos, cum alias magni laboriosam
              sequi soluta suscipit doloremque distinctio minima similique
              accusamus. Quaerat, magni! Molestias, similique aperiam?
            </p>
          </section>
          <section className="aboutImage">
            <img src="" alt="owner" />
          </section>
        </div>
        <div className="mostOrdered">
          <h2>Most Ordered Products </h2>
          <div className="mostOrderedCarousel">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="recommended">
          <h2>Our Recommendations </h2>
          <div className="mostRecommended">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="sales">
        <h2>Sales </h2>
          <div className="mostOrderedCarousel">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
