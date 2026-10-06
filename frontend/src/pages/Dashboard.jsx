import { useEffect, useState } from "react";
import { Building2, BriefcaseBusiness, CheckCircle2, FileText, GraduationCap, Plus, Trash2, Users } from "lucide-react";
import api from "../api";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  return <Layout>{user.role==="student"?<StudentDashboard/>:user.role==="company"?<CompanyDashboard/>:<AdminDashboard/>}</Layout>
}

function StudentDashboard(){
  const { user }=useAuth(); const [apps,setApps]=useState([]);
  useEffect(()=>{api.get("/opportunities/applications/mine").then(r=>setApps(r.data))},[]);
  const selected=apps.filter(a=>a.status==="Selected").length;
  return <><PageHead title={`Hello, ${user.name.split(" ")[0]} 👋`} sub="Track your placement journey from one place."/>
    <div className="stats-grid"><Stat icon={<FileText/>} value={apps.length} label="Applications"/><Stat icon={<CheckCircle2/>} value={selected} label="Offers"/><Stat icon={<GraduationCap/>} value={user.student?.cgpa||"-"} label="CGPA"/></div>
    <section className="card"><h2>My applications</h2>{apps.length?apps.map(a=><div className="list-row" key={a._id}><div><b>{a.opportunity?.title}</b><span>{a.opportunity?.company?.name} • {a.opportunity?.packageLPA} LPA</span></div><Status s={a.status}/></div>):<Empty text="No applications yet. Open Opportunities and apply to an eligible drive."/ >}</section></>
}

function CompanyDashboard(){
  const {user}=useAuth(); const [ops,setOps]=useState([]); const [show,setShow]=useState(false); const [selected,setSelected]=useState(null);
  const load=()=>api.get("/opportunities").then(r=>setOps(r.data)); useEffect(load,[]);
  return <><PageHead title={`${user.name} dashboard`} sub="Create drives and move the right candidates toward an offer." action={<button className="primary-btn" onClick={()=>setShow(true)}><Plus size={17}/> New opportunity</button>}/>
    <div className="stats-grid"><Stat icon={<BriefcaseBusiness/>} value={ops.length} label="Total drives"/><Stat icon={<CheckCircle2/>} value={ops.filter(o=>o.status==="Open").length} label="Open drives"/><Stat icon={<Building2/>} value={user.company?.industry||"Company"} label="Industry"/></div>
    <section className="card"><h2>Your placement drives</h2>{ops.length?ops.map(o=><div className="list-row" key={o._id}><div><b>{o.title}</b><span>{o.location} • {o.packageLPA} LPA • Min CGPA {o.minCGPA}</span></div><div className="row-actions"><button className="small-btn" onClick={()=>setSelected(o)}>Applicants</button><Status s={o.status}/></div></div>):<Empty text="No drives posted yet."/ >}</section>
    {show&&<OpportunityModal close={()=>setShow(false)} saved={()=>{setShow(false);load()}}/>}
    {selected&&<ApplicantsModal op={selected} close={()=>setSelected(null)}/>}
  </>
}

function AdminDashboard(){
  const [stats,setStats]=useState({}); const [users,setUsers]=useState([]);
  const load=()=>{api.get("/admin/stats").then(r=>setStats(r.data));api.get("/admin/users").then(r=>setUsers(r.data))}; useEffect(load,[]);
  const del=async id=>{if(confirm("Delete this user and related data?")){await api.delete(`/admin/users/${id}`);load()}};
  return <><PageHead title="Placement administration" sub="A bird's-eye view of your campus placement process."/>
    <div className="stats-grid admin-stats"><Stat icon={<GraduationCap/>} value={stats.students||0} label="Students"/><Stat icon={<Building2/>} value={stats.companies||0} label="Companies"/><Stat icon={<BriefcaseBusiness/>} value={stats.opportunities||0} label="Drives"/><Stat icon={<CheckCircle2/>} value={stats.selected||0} label="Selected"/></div>
    <section className="card"><h2>Registered users</h2>{users.map(u=><div className="list-row" key={u._id}><div><b>{u.name}</b><span>{u.email} • {u.role}</span></div><button className="icon-danger" onClick={()=>del(u._id)}><Trash2 size={17}/></button></div>)}</section></>
}

function OpportunityModal({close,saved}){
 const [f,setF]=useState({title:"",jobType:"Full Time",location:"",packageLPA:"",description:"",skills:"",minCGPA:6,maxBacklogs:0,eligibleBranches:"CST,CSE,IT,ECE",graduationYear:2028,deadline:""});
 const set=e=>setF({...f,[e.target.name]:e.target.value});
 const submit=async e=>{e.preventDefault();await api.post("/opportunities",{...f,packageLPA:Number(f.packageLPA),minCGPA:Number(f.minCGPA),maxBacklogs:Number(f.maxBacklogs),graduationYear:Number(f.graduationYear),skills:f.skills.split(",").map(x=>x.trim()).filter(Boolean),eligibleBranches:f.eligibleBranches.split(",").map(x=>x.trim()).filter(Boolean)});saved()};
 return <Modal close={close} title="Post placement opportunity"><form onSubmit={submit}><div className="two-col"><label>Job title<input name="title" required onChange={set}/></label><label>Location<input name="location" required onChange={set}/></label></div><div className="three-col"><label>Package (LPA)<input name="packageLPA" type="number" step=".1" required onChange={set}/></label><label>Min CGPA<input name="minCGPA" type="number" step=".1" value={f.minCGPA} onChange={set}/></label><label>Max backlogs<input name="maxBacklogs" type="number" value={f.maxBacklogs} onChange={set}/></label></div><div className="two-col"><label>Graduation year<input name="graduationYear" type="number" value={f.graduationYear} onChange={set}/></label><label>Deadline<input name="deadline" type="date" required onChange={set}/></label></div><label>Eligible branches (comma separated)<input name="eligibleBranches" value={f.eligibleBranches} onChange={set}/></label><label>Skills (comma separated)<input name="skills" onChange={set}/></label><label>Description<textarea name="description" required onChange={set}/></label><button className="primary-btn full">Publish opportunity</button></form></Modal>
}

function ApplicantsModal({op,close}){
 const [apps,setApps]=useState([]); const load=()=>api.get(`/opportunities/${op._id}/applicants`).then(r=>setApps(r.data)); useEffect(load,[]);
 const update=async(id,status)=>{await api.patch(`/opportunities/applications/${id}/status`,{status});load()};
 return <Modal close={close} title={`Applicants • ${op.title}`}>{apps.length?apps.map(a=><div className="applicant" key={a._id}><div><b>{a.student?.name}</b><span>{a.student?.email} • {a.student?.student?.branch} • CGPA {a.student?.student?.cgpa}</span></div><select value={a.status} onChange={e=>update(a._id,e.target.value)}><option>Applied</option><option>Shortlisted</option><option>Selected</option><option>Rejected</option></select></div>):<Empty text="No students have applied yet."/ >}</Modal>
}
function Modal({title,close,children}){return <div className="modal-backdrop" onMouseDown={close}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button onClick={close}>×</button></div>{children}</div></div>}
function PageHead({title,sub,action}){return <div className="page-head"><div><h1>{title}</h1><p>{sub}</p></div>{action}</div>}
function Stat({icon,value,label}){return <div className="stat-card"><div className="stat-icon">{icon}</div><div><b>{value}</b><span>{label}</span></div></div>}
function Status({s}){return <span className={`status ${s.toLowerCase()}`}>{s}</span>}
function Empty({text}){return <div className="empty"><Users size={30}/><p>{text}</p></div>}
