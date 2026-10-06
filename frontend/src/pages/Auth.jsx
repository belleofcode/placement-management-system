import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault(); setError("");
    try { await login(form); nav("/dashboard"); }
    catch (e) { setError(e.response?.data?.message || "Login failed"); }
  };

  return <AuthBox title="Welcome back" subtitle="Sign in to continue to your placement portal">
    <form onSubmit={submit}>
      <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
      <label>Password<input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
      {error && <div className="error">{error}</div>}
      <button className="primary-btn full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    </form>
    <p className="auth-foot">New here? <Link to="/register">Create an account</Link></p>
  </AuthBox>
}

export function Register() {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ name:"",email:"",password:"",rollNo:"",branch:"CST",graduationYear:2028,cgpa:"",backlogs:0,phone:"",website:"",industry:"",description:"" });
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const set = e => setForm({...form,[e.target.name]:e.target.value});

  const submit = async e => {
    e.preventDefault(); setError("");
    const payload = { name:form.name,email:form.email,password:form.password,role };
    if(role==="student") payload.student={rollNo:form.rollNo,branch:form.branch,graduationYear:Number(form.graduationYear),cgpa:Number(form.cgpa),backlogs:Number(form.backlogs),phone:form.phone};
    else payload.company={website:form.website,industry:form.industry,description:form.description};
    try { await register(payload); nav("/dashboard"); }
    catch(e){ setError(e.response?.data?.message || "Registration failed"); }
  };

  return <AuthBox title="Create your account" subtitle="Join the campus placement ecosystem">
    <div className="role-tabs"><button className={role==="student"?"selected":""} onClick={()=>setRole("student")}>Student</button><button className={role==="company"?"selected":""} onClick={()=>setRole("company")}>Company</button></div>
    <form onSubmit={submit}>
      <div className="two-col"><label>{role==="company"?"Company name":"Full name"}<input name="name" required value={form.name} onChange={set}/></label><label>Email<input name="email" type="email" required value={form.email} onChange={set}/></label></div>
      <label>Password<input name="password" type="password" minLength="6" required value={form.password} onChange={set}/></label>
      {role==="student" ? <>
        <div className="two-col"><label>Roll number<input name="rollNo" required value={form.rollNo} onChange={set}/></label><label>Branch<select name="branch" value={form.branch} onChange={set}><option>CST</option><option>CSE</option><option>ECE</option><option>EEE</option><option>IT</option><option>MECH</option><option>CIVIL</option></select></label></div>
        <div className="three-col"><label>Graduation year<input name="graduationYear" type="number" value={form.graduationYear} onChange={set}/></label><label>CGPA<input name="cgpa" type="number" step=".01" min="0" max="10" required value={form.cgpa} onChange={set}/></label><label>Backlogs<input name="backlogs" type="number" min="0" value={form.backlogs} onChange={set}/></label></div>
        <label>Phone<input name="phone" value={form.phone} onChange={set}/></label>
      </> : <>
        <div className="two-col"><label>Industry<input name="industry" required value={form.industry} onChange={set}/></label><label>Website<input name="website" value={form.website} onChange={set}/></label></div>
        <label>Company description<textarea name="description" value={form.description} onChange={set}/></label>
      </>}
      {error && <div className="error">{error}</div>}
      <button className="primary-btn full" disabled={loading}>{loading?"Creating...":"Create account"}</button>
    </form>
    <p className="auth-foot">Already registered? <Link to="/login">Sign in</Link></p>
  </AuthBox>
}

function AuthBox({title,subtitle,children}) {
  return <div className="auth-page"><Link to="/" className="brand auth-brand"><div className="brand-icon"><BriefcaseBusiness size={23}/></div><b>PlacePro</b></Link><div className="auth-card"><h1>{title}</h1><p>{subtitle}</p>{children}</div></div>
}
