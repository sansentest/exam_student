import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExamHome from './pages/ExamHome';
import ExamSection2 from './pages/ExamSection2';
import ExamSection3 from './pages/ExamSection3';
import Success from './pages/Success';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
      <div className="aurora-bg">
        <div className="aurora-glow"></div>
        <div className="aurora-glow"></div>
        <div className="aurora-glow"></div>
      </div>
      <Router basename="/exam_student">
        <Routes>
          <Route path="/" element={<ExamHome />} />
          <Route path="/section-2" element={<ExamSection2 />} />
          <Route path="/section-3" element={<ExamSection3 />} />
          <Route path="/success" element={<Success />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
