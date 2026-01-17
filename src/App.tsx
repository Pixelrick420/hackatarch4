import './App.css';
import About from './Components/About';
import CommunityPartners from './Components/CommunityPartners';
import ScrollingDivider from './Components/Divider';
import Events from './Components/Events';
import Hero from './Components/Hero';
// import FluidCursor from './Components/Mouse';
import Sponsors from './Components/Sponsors';
import Workshops from './Components/WorkShops';

function App() {
    return (
        <>
            {/* <FluidCursor> */}
            <Hero />
            <ScrollingDivider />
            <About />
            <Events />
            <Workshops />
            <Sponsors />
            <CommunityPartners />
            {/* </FluidCursor> */}
        </>
    );
}

export default App;
