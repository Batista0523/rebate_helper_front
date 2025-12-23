import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import { useAuth } from "./context/AuthContext";
// import Clients from "./Pages/Clients";
import NewClient from "./Pages/NewClient";
import OneApplication from "./Pages/OneApplication";
import ApplicationsPage from "./Pages/Applications";
import CreateApplication from "./Pages/ CreateApplication";
function Register() {
  return (
    <main className="container py-5">
      <h1 className="h4">Create your account</h1>
      <p className="text-secondary">Registration page coming soon.</p>
    </main>
  );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function GuestOnly({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
        {/* <Route path="/clients" element={<Clients />} /> */}
        <Route path="/newClients" element={<NewClient />} />
         <Route path="/applications/:id" element={<OneApplication />} />
         <Route path="/newApplication" element={<CreateApplication />} />
        <Route path="/applications_pages" element={<ApplicationsPage />} />
      </Routes>
    </>
  );
}

export default App;
