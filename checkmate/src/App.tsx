import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TestProvider } from './context/TestContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TestsPage from './pages/TestsPage';
import CreateTestPage from './pages/CreateTestPage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css';

function App() {
  return (
    <TestProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tests" element={<TestsPage />} />
              <Route path="/create" element={<CreateTestPage />} />
              <Route path="/edit/:testId" element={<CreateTestPage />} />
              <Route path="/test/:testId" element={<TestPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </TestProvider>
  );
}

export default App;
