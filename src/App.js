import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Login from './views/login/index.jsx';
import SignUp from './views/signup/index.jsx';
import Dashboard from './views/dashboard/index.jsx';
import ProtectedLayout from './layouts/ProtectedLayout';
import VitalTask from './views/vitalTask/index.jsx';
import MyTask from './views/my-tasks/index.jsx';
import ViewTask from './views/view-task/index.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vital-tasks" element={<VitalTask />} />
          <Route path="/task/:id" element={<ViewTask />} />
          <Route path="/my-tasks" element={<MyTask />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App