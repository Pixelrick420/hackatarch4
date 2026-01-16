import './App.css';
import About from './Components/About';
import Clubs from './Components/Clubs';
import CommunityPartners from './Components/CommunityPartners';
import ScrollingDivider from './Components/Divider';
import Hero from './Components/Hero';
import Sponsors from './Components/Sponsors';
import Timer from './Components/Timer';
import Workshops from './Components/WorkShops';

function App() {
    return (
        <>
            <Hero />
            <ScrollingDivider />
            <About />
            <Clubs />
            <Timer />
            <Workshops />
            <Sponsors />
            <CommunityPartners />
        </>
    );
}

export default App;
