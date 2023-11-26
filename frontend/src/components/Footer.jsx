import "../Styles/Footer.css";
import { BiLogoWhatsapp } from "react-icons/bi";
import { BiLogoInstagram } from "react-icons/bi";
import { MdLocationPin } from "react-icons/md";
const Footer = () => {
  return (
    <section className="Footer">
      <h1>Just Smile</h1>
      <div>
        <p>Delivery Info</p>
        <p>Privacy Policy</p>
      </div>
      <p>© 2023. Just Smile. All Rights Reserved.</p>
      <hr className="hr" />
      <div className="socialMedia">
        <a href="https://maps.app.goo.gl/9c4HfQJ8VaDQD6rT8" target="_blank">
          {" "}
          <MdLocationPin className="footerIcon locationIcon" />
        </a>
        <a href="https://www.instagram.com/justsmile.organic_juices/" target="_blank">
          {" "}
          <BiLogoInstagram className="footerIcon instaIcon" />
        </a>
        <a href="https://wa.me/70503796">
          <BiLogoWhatsapp className="footerIcon whatsAppIcon" target="_blank"/>
        </a>
      </div>
    </section>
  );
};
export default Footer;
