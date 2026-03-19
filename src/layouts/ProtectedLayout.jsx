import { Box } from '@mui/material';
import { Outlet, Navigate } from 'react-router-dom';
import SideBar from '../components/SideBar';

const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, ml: { md: '280px' }, minHeight: '100vh', bgcolor: '#F8F9FA' }}>
        <Outlet />
      </Box>
    </Box>
  );
};
export default ProtectedLayout;