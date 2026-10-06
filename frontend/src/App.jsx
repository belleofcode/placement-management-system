import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import { Login, Register } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";

function Protected({children}) {
  const {user}=useAuth();
  return user ? children : <Navigate to="/login" replace/>;
}
export default function App(){
 const {user}=useAuth();
 return <Routes>
   <Route path="/" element={<Home/>}/>
   <Route path="/login" element={user?<Navigate to="/dashboard"/>:<Login/>}/>
   <Route path="/register" element={user?<Navigate to="/dashboard"/>:<Register/>}/>
   <Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>
   <Route path="/opportunities" element={<Protected><Opportunities/></Protected>}/>
   <Route path="*" element={<Navigate to="/"/>}/>
 </Routes>
}
