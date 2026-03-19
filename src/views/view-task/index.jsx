import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Paper, CircularProgress, Stack } from '@mui/material';
import { Delete, Edit, PriorityHigh, ArrowBack } from '@mui/icons-material';
import SideBar from '../../components/SideBar';
import { getTaskById } from '../../services/taskServices';

const ViewTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const data = await getTaskById(id);
        setTask(data);
      } catch (err) {
        setError(err || "Failed to fetch task");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="error" /></Box>;
  if (error) return <Typography color="error" align="center" sx={{ mt: 5 }}>{error}</Typography>;
  if (!task) return <Typography align="center" sx={{ mt: 5 }}>Task not found.</Typography>;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      <SideBar />
      
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, ml: { md: '20px' } }} className='min-h-[100%]'>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#FF5A5F', mb: 4, fontFamily: 'Arial' }}>
          ToDoHQ
        </Typography>

        <Paper sx={{ p: 4, borderRadius: '24px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', minHeight: '90%' }}>
          {/* Header Row */}
          <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
            {task.imageUrl && (
              <Box 
                component="img" 
                src={task.imageUrl} 
                sx={{ width: 200, height: 200, borderRadius: '20px', objectFit: 'cover' }} 
              />
            )}
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{task.title}</Typography>
                <Typography 
                  onClick={() => navigate(-1)} 
                  sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'underline' }}
                >
                  Go Back
                </Typography>
              </Box>
              
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Priority: <span style={{ color: '#2196F3', fontWeight: 400 }}>{task.priority}</span>
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Status: <span style={{ color: '#FF5A5F', fontWeight: 400 }}>{task.status}</span>
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  Created on: {new Date(task.createdAt).toLocaleDateString('en-GB')}
                </Typography>
              </Stack>
            </Box>
          </Box>

          {/* Description Section */}
          <Box sx={{ mb: 4, minHeight: '50%' }}>
            <Typography variant="body1" sx={{ color: '#4F4F4F', lineHeight: 1.7, mb: 3}}>
              {task.description}
            </Typography>
            
            {/* Action Icons at Bottom Right */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 10 }}>
              <IconButton sx={{ bgcolor: '#FF8A8A', color: 'white', '&:hover': { bgcolor: '#FF5A5F' }, borderRadius: '8px' }}>
                <Delete fontSize="small" />
              </IconButton>
              <IconButton sx={{ bgcolor: '#FF8A8A', color: 'white', '&:hover': { bgcolor: '#FF5A5F' }, borderRadius: '8px' }}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton sx={{ bgcolor: '#FF8A8A', color: 'white', '&:hover': { bgcolor: '#FF5A5F' }, borderRadius: '8px' }}>
                <PriorityHigh fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewTask;