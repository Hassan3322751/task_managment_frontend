import { useState } from 'react';
import { Card, Typography, Box, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import { MoreHoriz, RadioButtonUnchecked, CheckCircleOutline } from '@mui/icons-material';
import { formatTimeAgo } from '../utilities/formatTimeAgo';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, compact }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isCompleted = task.status === 'Completed';

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Card sx={{ 
      borderRadius: 4, 
      p: 2, 
      mb: 2, 
      boxShadow: 'none', 
      border: '1px solid #E0E0E0',
      bgcolor: 'white',
      position: 'relative'
    }} className={'min-w-96'}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Status Icon */}
        <IconButton 
          onClick={() => onToggleComplete(task._id, 'Completed')} 
          sx={{ p: 0, mt: 0.5, color: isCompleted ? '#4CAF50' : '#FF5A5F' }}
        >
          {isCompleted ? <CheckCircleOutline /> : <RadioButtonUnchecked />}
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#333' }}>
              {task.title}
            </Typography>
            <IconButton size="small" onClick={handleOpen}>
              <MoreHoriz />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ color: '#666', mb: 2, mt: 0.5 }}>
            {task.description}
          </Typography>

          {/* Image (conditionally rendered) */}
          {task.imageUrl && (
            <Box sx={{ float: 'right', ml: 2, mb: 1 }}>
              <img src={task.imageUrl} alt="" style={{ width: 80, height: 60, borderRadius: 8, objectFit: 'cover' }} />
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            {!compact && (
              <Typography variant="caption" sx={{ color: '#999' }}>
                Priority: <span style={{ color: '#2196F3' }}>{task.priority}</span>
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: '#999' }}>
              Status: <span style={{ color: isCompleted ? '#4CAF50' : '#FF5A5F' }}>{task.status}</span>
            </Typography>
            {!compact && (
              <Typography variant="caption" sx={{ color: '#999' }}>
                Created on: {new Date(task.createdAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
          {compact &&
            <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
              {`Completed ${formatTimeAgo(task.updatedAt)}`}
            </Typography>
          </Box>
          }
        </Box>
      </Box>

      {/* Menu for Edit/Delete */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => { onEdit(); handleClose(); }}>Edit</MenuItem>
        <MenuItem onClick={() => { onDelete(task._id); handleClose(); }} sx={{ color: 'red' }}>Delete</MenuItem>
      </Menu>
    </Card>
  );
};

export default TaskCard;
