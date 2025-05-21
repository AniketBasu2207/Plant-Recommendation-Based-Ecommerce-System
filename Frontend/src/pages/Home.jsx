import React from "react";
import Hero from "../components/Hero";
import Contact from "./Contact";
import VerticalStepper1 from "../components/Vertical-Stepper";
import ReviewSlider from "../components/Reviews";
import PlantCarousel from "./Plantslider";

const Home = () => {
  return (
    <div>
      <Hero />
      <VerticalStepper1 />
      <PlantCarousel />
      <ReviewSlider />
      <Contact />
    </div>
  );
};

export default Home;
