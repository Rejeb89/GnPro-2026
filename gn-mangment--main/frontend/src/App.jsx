import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Credits from './pages/Credits';
import RealEstate from './pages/RealEstate';
import Vehicles from './pages/Vehicles';
import Fuel from './pages/Fuel';
import Settings from './pages/Settings';
import ComingSoon from './components/ComingSoon';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/equipment" element={
            <ProtectedRoute>
              <Layout>
                <Equipment />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/credits" element={
            <ProtectedRoute>
              <Layout>
                <Credits />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/real-estate" element={
            <ProtectedRoute>
              <Layout>
                <RealEstate />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/vehicles" element={
            <ProtectedRoute>
              <Layout>
                <Vehicles />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/fuel" element={
            <ProtectedRoute>
              <Layout>
                <Fuel />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
