import "./App.css";
import About from "./Components/About";
import CommunityPartners from "./Components/CommunityPartners";
import Contact from "./Components/Contact";
import ScrollingDivider from "./Components/Divider";
import Events from "./Components/Events";
import Hero from "./Components/Hero";

import Sponsors from "./Components/Sponsors";
import Workshops from "./Components/WorkShops";

function App() {
  return (
    <>
      {/* <FluidCursor> */}
      <Hero />
      <ScrollingDivider />
      <About />

      <Contact />
      <Events />
      <Workshops />
      <Sponsors />
      <CommunityPartners />
      {/* </FluidCursor> */}
    </>
  );
}

export default App;
