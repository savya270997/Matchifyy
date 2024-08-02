import React from "react";
import "./AboutUs.css";
import Header from "./Header";
import myimage from "../images/finish-1.png";
import fullsport from "../images/Full-sport.png";
import unite from "../images/unite.png";
import appfeatures from "../images/appfeatures.png";
import bestchoice from "../images/bestchoice.png";

const AboutUs = () => {
  return (
    <>
      <Header />
      <div className="about-us-container">
        <div className="about-section card-left">
          <img src={fullsport} alt="About Matchifyy" className="about-img" />
          <div className="about-text">
            <h2>About Matchifyy</h2>
            <p>
              Welcome to Matchifyy, your ultimate platform for connecting with
              like-minded individuals through engaging activities and sports.
              Whether you're an avid sports enthusiast, a casual player, or
              someone looking to make new friends through fun activities,
              Matchifyy is here to bring people together and create memorable
              experiences.
            </p>
          </div>
        </div>

        <div className="about-section card-right">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              At Matchifyy, we believe in the power of community and the joy of
              shared experiences. Our mission is to provide a user-friendly
              platform that makes it easy to organize and join pools for various
              games and activities. We aim to foster connections, promote active
              lifestyles, and enhance social interactions through our innovative
              features and dynamic user interface.
            </p>
          </div>
          <img src={unite} alt="Our Mission" className="about-img" />
        </div>

        <div className="about-section card-left">
          <img src={appfeatures} alt="Key Features" className="about-img" />
          <div className="about-text">
            <h2>Key Features</h2>
            <ul>
              <li>
                <strong>Create Pools:</strong> Easily organize and manage your
                own pools for different activities. Customize details such as
                game name, area, venue, date, time, and player requirements to
                suit your needs.
              </li>
              <li>
                <strong>Join Pools:</strong> Browse and join existing pools that
                match your interests and availability. Stay updated with the
                latest activities happening in your area and connect with fellow
                participants.
              </li>

              <li>
                <strong>Real-Time Updates:</strong> Receive real-time
                notifications and updates on pool activities, ensuring you never
                miss out on any exciting events.
              </li>
              <li>
                <strong>Dynamic Dashboard:</strong> Access a dynamic dashboard
                that displays all upcoming pools, keeping you informed and
                engaged with the community.
              </li>
            </ul>
          </div>
        </div>

        <div className="about-section card-right">
          <div className="about-text">
            <h2>Why Choose Matchifyy?</h2>
            <ul>
              <li>
                <strong>User-Centric Design:</strong> Our platform is designed
                with a focus on user experience, making it easy for you to
                navigate and find the information you need.
              </li>
              <li>
                <strong>Community Engagement:</strong> Join a vibrant community
                of individuals who share your interests and passions. Build
                lasting connections and enjoy collaborative activities.
              </li>
              <li>
                <strong>Secure and Reliable:</strong> We prioritize the security
                and privacy of our users. Your personal information and activity
                details are securely stored and managed.
              </li>
            </ul>
          </div>
          <img
            src={bestchoice}
            alt="Why Choose Matchifyy"
            className="about-img"
          />
        </div>

        <div className="about-section card-left">
          <img src={myimage} alt="Join Us Today" className="about-img" />
          <div className="about-text">
            <h2>Join Us Today</h2>
            <p>
              Discover new activities, meet new people, and create unforgettable
              memories with Matchifyy. Whether you're looking to organize a
              game, join a pool, or simply explore what's happening in your
              area, Matchifyy is your go-to platform for all things fun and
              active.
            </p>
            <p>
              <strong>Connect. Play. Enjoy.</strong>
            </p>
            <p>Welcome to Matchifyy!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
