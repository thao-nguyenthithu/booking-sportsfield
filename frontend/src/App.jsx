import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import HomePage from './components/home/HomePage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import Dashboard from './components/dashboard/Dashboard';
import FieldList from './components/fields/FieldList';
import BookingForm from './components/booking/BookingForm';
import BookingHistory from './components/booking/BookingHistory';
import AdminDashboard from './components/admin/AdminDashboard';
import Navigation from './components/common/Navigation';
import ProtectedRoute from './components/common/ProtectedRoute';
import OwnerAuth from './pages/OwnerAuth';
import OwnerDashboard from './components/dashboard/OwnerDashboard';

// Add placeholder components for player and owner dashboards if not present
const PlayerHome = () => <div className="p-8 text-2xl text-center">Chào mừng Người chơi!</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            {/* Home Page as default */}
            <Route path="/" element={<HomePage />} />
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/owner" element={<OwnerAuth />} />
            <Route path="/fields" element={<FieldList />} />
            {/* Protected User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/booking/:fieldId" element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            } />
            <Route path="/bookings/history" element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            } />
            <Route path="/player/home" element={<ProtectedRoute role="PLAYER"><PlayerHome /></ProtectedRoute>} />
            <Route path="/owner/dashboard" element={<ProtectedRoute role="OWNER"><OwnerDashboard /></ProtectedRoute>} />
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
