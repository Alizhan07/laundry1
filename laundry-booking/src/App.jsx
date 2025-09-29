import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Washers from "./pages/Washers";
import Dryers from "./pages/Dryers";
import MachinePage from "./pages/MachinePage";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="main-container">
        <h1>Система бронирования</h1>
        <Routes>
          <Route
            path="/"
            element={
              <div className="main-buttons">
                <Link to="/washers" className="btn blue">Стиральные машины</Link>
                <Link to="/dryers" className="btn green">Сушильные машины</Link>
              </div>
            }
          />
          <Route path="/washers" element={<Washers />} />
          <Route path="/dryers" element={<Dryers />} />
          <Route path="/:type/:id" element={<MachinePage />} />
        </Routes>
      </div>
    </Router>
  );
}


