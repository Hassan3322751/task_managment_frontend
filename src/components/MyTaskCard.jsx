import { useState } from 'react';
import { Card, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz, Visibility, RadioButtonUnchecked, CheckCircleOutline } from '@mui/icons-material';
import { Navigate, useNavigate } from 'react-router-dom';

const MyTaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const status = task.status || 'Not Started';
  const priority = task.priority || 'Moderate';
  const isCompleted = status === 'Completed';

  const navigate = useNavigate()

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Status Colors based on design
  const getStatusColor = () => {
    if (isCompleted) return '#4CAF50';
    if (status === 'In Progress') return '#2196F3';
    return '#FF5A5F'; // Not Started / Extreme
  };

  const statusColor = getStatusColor();

  return (
    <Card
      sx={{
        bgcolor: '#F8F9FA',
        borderRadius: '24px',
        p: 2.5,
        mb: 2,
        boxShadow: 'none',
        border: '1px solid #E0E0E0',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: '#BDBDBD' }
      }}
    >
      {/* Left Content Side */}
      <Box sx={{ flex: 1, pr: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <IconButton 
            size="small" 
            sx={{ p: 0, color: statusColor }}
            onClick={() => onToggleStatus(task._id, isCompleted ? 'Not Started' : 'Completed')}
          >
            {isCompleted ? <CheckCircleOutline /> : <RadioButtonUnchecked />}
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A1A1A' }}>
            {task.title}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#828282', mb: 2, maxWidth: '90%' }}>
          {task.description || "No description provided..."}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#4F4F4F', fontWeight: 500 }}>
            Priority: <span style={{ color: priority === 'Extreme' ? '#FF5A5F' : '#2196F3' }}>{priority}</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#4F4F4F', fontWeight: 500 }}>
            Status: <span style={{ color: statusColor }}>{status}</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#BDBDBD' }}>
            Created on: {new Date(task.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <button
            onClick={() => onToggleStatus(task._id, 'Completed')}
            style={{
              backgroundColor: isCompleted ? '#FF5A5F80' : '#FF5A5F',
              color: 'white',
              border: 'none',
              padding: '8px 24px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Complete
          </button>
          <button
            onClick={() => onToggleStatus(task._id, 'Pending')}
            style={{
              backgroundColor: '#F35528',
              color: 'white',
              border: 'none',
              padding: '8px 24px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Pending
          </button>
          <button
            onClick={() => onToggleStatus(task._id, 'In Progress')}
            style={{
              backgroundColor: '#FF5A5F',
              color: 'white',
              border: 'none',
              padding: '8px 24px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            In Progress
          </button>
          
          <IconButton 
            size="small" 
            sx={{ ml: 1, color: '#000' }}
            onClick={() => navigate(`/task/${task._id}`)} // Add navigate hook
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Right Image Side */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <IconButton size="small" onClick={handleMenuOpen} sx={{ mt: -1, mr: -1 }}>
          <MoreHoriz />
        </IconButton>
        
        {task.imageUrl && (
          <Box 
            component="img"
            src={task.imageUrl}
            sx={{
              width: 180,
              height: 110,
              borderRadius: '16px',
              objectFit: 'cover',
              mt: 1
            }}
          />
        )}
      </Box>

      {/* 3-Dot Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { onEdit(task); handleMenuClose(); }}>Edit</MenuItem>
        <MenuItem onClick={() => { onDelete(task._id); handleMenuClose(); }} sx={{ color: 'red' }}>Delete</MenuItem>
      </Menu>
    </Card>
  );
};

export default MyTaskCard;