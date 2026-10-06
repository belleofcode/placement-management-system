import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Building2, GraduationCap, ShieldCheck } from "lucide-react";

export default function Home() {
  return <div className="landing">
    <header className="topbar">
      <div className="brand"><div className="brand-icon"><BriefcaseBusiness size={24}/></div><b>PlacePro</b></div>
      <div><Link className="ghost-btn" to="/login">Sign in</Link><Link className="primary-btn" to="/register">Get started</Link></div>
    </header>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">CAMPUS PLACEMENTS, SIMPLIFIED</span>
        <h1>From opportunity to <span>offer letter.</span></h1>
        <p>A single placement hub for students, recruiters and placement administrators. Publish drives, check eligibility, manage applicants and announce results without spreadsheet chaos.</p>
        <div className="hero-actions"><Link className="primary-btn large" to="/register">Create account <ArrowRight size={18}/></Link><Link className="ghost-btn large" to="/login">Sign in</Link></div>
        <div className="mini-stats"><div><b>3</b><span>Role-based portals</span></div><div><b>100%</b><span>Digital workflow</span></div><div><b>1</b><span>Central database</span></div></div>
      </div>
      <div className="hero-panel">
        <div className="panel-glow"></div>
        <div className="mock-window">
          <div className="mock-head"><span></span><span></span><span></span></div>
          <div className="mock-title">Placement overview</div>
          <div className="mock-grid">
            <div className="mock-stat"><GraduationCap/><b>248</b><small>Students</small></div>
            <div className="mock-stat"><Building2/><b>18</b><small>Companies</small></div>
            <div className="mock-stat"><BriefcaseBusiness/><b>32</b><small>Openings</small></div>
          </div>
          <div className="mock-row"><div><b>Software Engineer</b><small>NovaTech • 8.5 LPA</small></div><span>Open</span></div>
          <div className="mock-row"><div><b>Data Analyst</b><small>DataWorks • 6.2 LPA</small></div><span>Open</span></div>
          <div className="mock-row"><div><b>Graduate Trainee</b><small>CloudNine • 5.8 LPA</small></div><span>Open</span></div>
        </div>
      </div>
    </section>
    <section className="features">
      <div><GraduationCap/><h3>For Students</h3><p>See matching drives, apply once and track every application.</p></div>
      <div><Building2/><h3>For Companies</h3><p>Publish opportunities and manage candidates from one dashboard.</p></div>
      <div><ShieldCheck/><h3>For Admin</h3><p>Monitor eligibility, users, drives and final placement results.</p></div>
    </section>
  </div>
}
