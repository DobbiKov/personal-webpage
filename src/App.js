import logo from './logo.svg';
import './App.css';
import './components/Header.css';
import './components/MainPage.css';
import { Routes, Route, Link } from 'react-router-dom';
import MainPage from './components/MainPage';
import LectureNotes from './components/LectureNotes';
import ContactPage from './components/ContactPage';
import AboutMe from './components/AboutMe';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about_me" element={<AboutMe />} />
        <Route path="/lecture_notes" element={<LectureNotes />} />
        <Route path="/contact_me" element={<ContactPage />} />
      </Routes>
    </div>
  );
}

export default App;
