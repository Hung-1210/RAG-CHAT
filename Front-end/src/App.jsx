import React from 'react';
import './App.css';
import RAGInterface from './components/RAGInterface';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './services/authService';


// Placeholder components for modules
const FilesModule = () => (
  <div className="bg-white rounded-xl p-8 shadow-sm">
    <h1 className="text-2xl font-bold mb-4">Quản lý File & Folder</h1>
    <p className="text-gray-600">Module đang được phát triển...</p>
  </div>
);

<RAGInterface />

const DigitalSignatureModule = () => (
  <div className="bg-white rounded-xl p-8 shadow-sm">
    <h1 className="text-2xl font-bold mb-4">Ký số</h1>
    <p className="text-gray-600">Module đang được phát triển...</p>
  </div>
);

const RiskMonitoringModule = () => (
  <div className="bg-white rounded-xl p-8 shadow-sm">
    <h1 className="text-2xl font-bold mb-4">Giám sát Rủi ro</h1>
    <p className="text-gray-600">Module đang được phát triển...</p>
    <p className="text-sm text-gray-500 mt-2">Chỉ dành cho Admin</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Register />} 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="files" element={<FilesModule />} />
          <Route path="rag-chat" element={<RAGInterface />} />
          <Route path="digital-signature" element={<DigitalSignatureModule />} />
          <Route 
            path="risk-monitoring" 
            element={
              <ProtectedRoute requiredRole="admin">
                <RiskMonitoringModule />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// function App() {
//   return (
//     <div className="App">
//       {/* <DocumentChatApp /> */}
//       <RAGInterface />
//     </div>
//   );
// }

// export default App;