import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Scenarios from "./pages/Scenarios";
import NlpConsole from "./pages/NlpConsole";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/verify" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/billing/success" element={<Billing />} />
      <Route path="/scenarios" element={<Scenarios />} />
      <Route path="/nlp" element={<NlpConsole />} />
    </Routes>
  );
}
