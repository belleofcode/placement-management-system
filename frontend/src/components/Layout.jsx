import { BriefcaseBusiness, LayoutDashboard, LogOut, GraduationCap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  return <div className="app-shell">
    <aside className="sidebar">
      <Link to="/" className="brand"><div className="brand-icon"><BriefcaseBusiness size={24}/></div><div><b>PlacePro</b><span>Placement Portal</span></div></Link>
      <div className="profile-card">
        <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <div><strong>{user?.name}</strong><small>{user?.role}</small></div>
      </div>
      <nav>
        <Link className={location.pathname === "/dashboard" ? "active" : ""} to="/dashboard"><LayoutDashboard size={19}/> Dashboard</Link>
        <Link className={location.pathname === "/opportunities" ? "active" : ""} to="/opportunities"><GraduationCap size={19}/> Opportunities</Link>
      </nav>
      <button className="logout" onClick={logout}><LogOut size={18}/> Sign out</button>
    </aside>
    <main className="main">{children}</main>
  </div>
}
