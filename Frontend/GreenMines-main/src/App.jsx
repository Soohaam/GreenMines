import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Companies from './components/Companies';
import Services from './components/Services';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Clients from './components/Clients';
import Footer from './components/Footer';
import ScrollArrow from './components/ScrollArrow';
import Emission from './components/Emission';
import './app.css';
import Neutrality from './components/Neutrality';
import NeutralityResult from './components/NeutralityResult';
import AboutUs from './components/AboutUs';
import AboutUsPage from './components/AboutUsPage';
import ContactUs from './components/ContactUs';
import GraphPage from './components/GraphPage';
import DashBoard from './components/DashBoard';
import Renewable from './components/RenewableSource';
import ChatBot from './components/Chatbot';
import CCSCalculator from './components/CCS';
import EmissionsAnalysisPage from "./components/EmissionsAnalysisPage";
import AFOLUForm from './components/AFOLUForm';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Login from './components/Login';
import Enable2FA from './components/Enable2FA';
import Register from './components/Register';
import MovingText from './components/MarqueeText';
import Prediction from './components/Predictions'
import NeutralityOptions from './components/NeutralityOptions';
import ChatAssistant from './components/ChatAssistant';
import Profile from './components/Profile';
import EnvironmentalReportPage from './pages/EnvironmentalReportPage';
import Routing from './components/RouteFrm'
import { MarqueeReviews } from './components/ReviewCard';
import CoalEmission from './components/CoalEmission';
import EvSavingsCalculator from './components/EvSavingsCalculator';
import MCS from './components/MCS';
import MCSCalculator from './components/MCS';
import RequiredLand from "./components/RequiredLand"
import RegenerativeZoneMap from './components/RegenerativeZoneMap';
import NeutralityGraph from './components/NeutralityGraph';
import Test from './components/Test';
function App() {
  return (
    <div className="App font-link">
    
     
      <Routes>
      <Route path="/" element={
          <>
          <ChatAssistant />
            <Header id="home" />
            <MovingText
        text="Sustainable Future Green World"
        fontSize={100}
        outlineColor="#10B981"
        fillColor="#10B981"
        duration={8}
      />
            <ScrollArrow />
            {/* <Companies id="about" /> */}
            <Services id="services" />
            {/* <Experience /> */}
            <Projects id="projects" />
            <MarqueeReviews/>
            <Clients />
            <Footer />
          </>
        } />
        <Route path="/services" element={<Services id="services" />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects id="projects" />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/emission" element={<Emission />} />
        <Route path="/neutrality" element={<Neutrality />} />
        <Route path="/neutralityresult" element={<NeutralityResult />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/graphpage" element={<GraphPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/renewable" element={<Renewable />} />
        <Route path="/chatbot" element={<ChatBot/>} />
        <Route path="/CCS" element={<CCSCalculator/>}/>
        <Route path="/MCS" element={<MCS/>}/>
        <Route path="/emissions-analysis" element={<EmissionsAnalysisPage />} />
        <Route path="/afolu" element={<AFOLUForm />} />
        <Route path="/predictions" element={<Prediction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup-2fa" element={<Enable2FA />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/neutralityoptions" element={<NeutralityOptions />} />
        <Route path="/chatassistant" element={<ChatAssistant />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/environmental-reports" element={<EnvironmentalReportPage />} />
        <Route path="/routing" element={<Routing />} />
        <Route path='/coalemission' element={<CoalEmission/>}/>
        <Route path='/ev' element={<EvSavingsCalculator/>}/>
        <Route path='/requiredland' element={<RequiredLand/>}/>
        <Route path='/zone' element={<RegenerativeZoneMap />} />
        <Route path='/neutralitygraph' element={<NeutralityGraph />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      
    </div>
  );
}

export default App;
