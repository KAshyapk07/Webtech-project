import React from 'react'
import './Hero.css';
import arrow_icon from '../Assets/arrow.png';
import GtaV from '../Assets/GTAV2.jpg';
import GtaV_background from "../Assets/Background Video/GtaV_background.mp4"

const Hero = () => {

  const scrollToNewCollections = () => {
    const section = document.getElementById('new-collections');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      
   
    <div class="hero">
    <video id='Background-clip2' autoPlay muted loop src={GtaV_background}></video>
      <div class="hero-left">
      <h2>New Arrivals Only</h2>
          <div>
            <p>Collections </p>
            <p>for everyone</p>
      </div>
      <div class="hero-latest-btn" onClick={scrollToNewCollections}>
        <div>Latest Collection</div>
        <img src={arrow_icon} alt="" />
      </div>

      </div>
      <div class="hero-right">
        <img src={GtaV} alt="" />

    </div>
    </div>
    </div>
  )
}

export default Hero