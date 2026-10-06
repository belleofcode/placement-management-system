import { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarDays, MapPin, Search } from "lucide-react";
import api from "../api";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function Opportunities(){
 const {user}=useAuth(); const [ops,setOps]=useState([]); const [apps,setApps]=useState([]); const [q,setQ]=useState(""); const [msg,setMsg]=useState("");
 useEffect(()=>{api.get("/opportunities").then(r=>setOps(r.data)); if(user.role==="student") api.get("/opportunities/applications/mine").then(r=>setApps(r.data))},[]);
 const applied=new Set(apps.map(a=>a.opportunity?._id));
 const apply=async id=>{setMsg("");try{await api.post(`/opportunities/${id}/apply`);setMsg("Application submitted successfully.");const r=await api.get("/opportunities/applications/mine");setApps(r.data)}catch(e){setMsg(e.response?.data?.message||"Could not apply")}};
 const filtered=ops.filter(o=>(o.title+" "+o.company?.name+" "+o.location).toLowerCase().includes(q.toLowerCase()));
 return <Layout><div className="page-head"><div><h1>{user.role==="company"?"Your opportunities":"Placement opportunities"}</h1><p>{user.role==="student"?"Find a role that matches your profile and eligibility.":"Browse current placement drives."}</p></div></div>
 <div className="search"><Search size={18}/><input placeholder="Search job, company or location..." value={q} onChange={e=>setQ(e.target.value)}/></div>
 {msg&&<div className="notice">{msg}</div>}
 <div className="op-grid">{filtered.map(o=><article className="op-card" key={o._id}><div className="company-mark"><BriefcaseBusiness/></div><div className="op-top"><span>{o.company?.name}</span><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></div><h2>{o.title}</h2><div className="meta"><span><MapPin size={15}/>{o.location}</span><span><CalendarDays size={15}/>Deadline {new Date(o.deadline).toLocaleDateString()}</span></div><p>{o.description}</p><div className="chips">{o.eligibleBranches?.map(b=><span key={b}>{b}</span>)}</div><div className="op-bottom"><div><b>{o.packageLPA} LPA</b><small>Min CGPA {o.minCGPA} • Max backlogs {o.maxBacklogs}</small></div>{user.role==="student"&&<button disabled={applied.has(o._id)} onClick={()=>apply(o._id)} className="primary-btn">{applied.has(o._id)?"Applied":"Apply now"}</button>}</div></article>)}</div>
 </Layout>
}
