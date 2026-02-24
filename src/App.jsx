import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Assessments from './pages/Assessments';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/practice" element={<Layout />}>
          <Route index element={<Practice />} />
        </Route>
        <Route path="/assessments" element={<Layout />}>
          <Route index element={<Assessments />} />
        </Route>
        <Route path="/resources" element={<Layout />}>
          <Route index element={<Resources />} />
        </Route>
        <Route path="/profile" element={<Layout />}>
          <Route index element={<Profile />} />
        </Route>
        <Route path="/analyze" element={<Layout />}>
          <Route index element={<Analyze />} />
        </Route>
        <Route path="/results" element={<Layout />}>
          <Route index element={<Results />} />
        </Route>
        <Route path="/history" element={<Layout />}>
          <Route index element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
