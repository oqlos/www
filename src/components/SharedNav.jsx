import { Link } from "react-router-dom";

export default function SharedNav({ user, onLogout }) {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo"><em>OqlOS</em></Link>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/scenarios">Scenarios</Link>
        <Link to="/nlp">NLP Console</Link>
        <Link to="/billing">Billing</Link>
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{user?.email}</span>
        {onLogout && (
          <button className="btn btn-outline btn-sm" onClick={onLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
