import './App.css';
import Clubs from './Components/Clubs';
import CommunityPartners from './Components/CommunityPartners';
import Hero from './Components/Hero';
// import Timer from './Components/Timer';
import Workshops from './Components/WorkShops';

function App() {
    return (
        <>
            <Hero />
            <Clubs />
            {/* <Timer /> */}
            <Workshops />
            <CommunityPartners />
        </>
    );
}

export default App;
