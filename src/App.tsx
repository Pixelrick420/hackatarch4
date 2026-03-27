import "./App.css";
import About from "./Components/About";
import CommunityPartners from "./Components/CommunityPartners";
import Contact from "./Components/Contact";
import ScrollingDivider from "./Components/Divider";
import Events from "./Components/Events";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import Sponsors from "./Components/Sponsors";
import Workshops from "./Components/WorkShops";
import { Analytics } from "@vercel/analytics/react";

function App({ ready = false }: { ready?: boolean }) {
  return (
    <>
      {/* <FluidCursor> */}
      <Navbar />
      <div id="hero">
        <Hero ready={ready} />
      </div>
      <ScrollingDivider />
      <div id="about">
        <About />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <div id="events">
        <Events />
      </div>
      <div id="workshops">
        <Workshops />
      </div>
      <div id="sponsors">
        <Sponsors />
      </div>
      <CommunityPartners />
      <Analytics />
    </>
  );
}

export default App;
