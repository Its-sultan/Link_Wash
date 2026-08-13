import { Nav } from './components/Nav';
import { HeroSection } from "./components/Hero-section";
import { HowItWorks } from "./components/HowItWorks";
import { Footer} from "./components/Footer";
import { UrlDemo }from "./components/UrlDemo";
import { PrivacySection } from "./components/PrivacySection";
import { Banner } from "./components/Banner";


function App() {
  return (
   
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden transition-colors duration-300 ">
      <Nav/>
      <Banner />
      <HeroSection />
      <HowItWorks />
      <UrlDemo />
      <PrivacySection/>
      <Footer />
    </div>
  );
}

export default App;

