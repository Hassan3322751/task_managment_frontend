import { useState, useEffect, useCallback, useContext } from 'react';
import { Typography, Box, Button, Grid, CircularProgress, Stack, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import TaskFormDialog from '../../components/TaskFormDialog';
import SideBar from '../../components/SideBar';
import { deleteTask, getDashboardData, updateTaskStatus } from '../../services/taskServices';
import TaskCard from '../../components/TaskCard';
import { AuthContext } from '../../auth/AuthContext';

const Dashboard = ({ isVital = false }) => {
  const [data, setData] = useState({ activeTasks: [], completedTasks: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getDashboardData();
      setData(result);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleStatusChange = async (id, status) => {
    await updateTaskStatus(id, status);
    fetchDashboard();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete task?")) {
      await deleteTask(id);
      fetchDashboard();
    }
  };

  return (
    <>
    <Box sx={{ display: 'flex', bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      <SideBar />
      
      <Box sx={{p: { xs: 2, md: 5 }, ml: { md: '20px' } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
          {isVital ? "Vital Tasks ❗" : `Welcome back, ${user && user?.firstName} 👋`}
        </Typography>

        <Grid container spacing={3} className='border p-5'>
          {/* LEFT: Task Lists */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: isVital ? '#D32F2F' : '#FF5A5F', fontWeight: 600 }}>
                  {isVital ? "Critical To-Do" : "To-Do"}
                </Typography>
                <Button variant="primary" sx={{color: '#D32F2F'}} startIcon={<Add />} onClick={() => {setEditingTask(null); setOpenForm(true);}}>
                  New Task
                </Button>
              </Box>

              {loading ? <CircularProgress sx={{ display: 'block', m: 'auto' }} /> : (
                <Stack spacing={2}>
                  {data.activeTasks.length > 0 ? data.activeTasks.map(task => (
                    <TaskCard
                      key={task._id} 
                      task={task} 
                      onEdit={() => { setEditingTask(task); setOpenForm(true); }}
                      onToggleComplete={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  )) : (
                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                      No {isVital ? "high priority" : ""} tasks found.
                    </Typography>
                  )}
                </Stack>
              )}
            </Paper>
          </Grid>

          {/* RIGHT: Stats & Completed */}
          <Grid item xs={12} lg={4}>
            {/* Stats Widget */}
            <Paper sx={{ p: 3, borderRadius: 4, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Task Status</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <StatCircle value={data.stats.completed} label="Completed" color="#4CAF50" />
                <StatCircle value={data.stats.inProgress} label="In Progress" color="#2196F3" />
                <StatCircle value={data.stats.pending} label="Pending" color="#F44336" />
              </Box>
            </Paper>

            {/* Completed Tasks List */}
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#F0F2FF' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Recently Completed</Typography>
              <Stack spacing={2}>
                {data.completedTasks.map(task => (
                  <TaskCard key={task._id} task={task} compact onEdit={() => { setEditingTask(task); setOpenForm(true); }} 
                  onDelete={handleDelete} onToggleComplete={handleStatusChange}/>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <TaskFormDialog
        open={openForm}
        task={editingTask}
        onClose={() => setOpenForm(false)}
        onSuccess={() => { 
          setOpenForm(false); 
          fetchDashboard(); 
        }}
    />
    </Box>
    </>
  );
};

const StatCircle = ({ value, label, color }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
      <CircularProgress variant="determinate" value={value} size={55} sx={{ color }} thickness={5} />
      <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 800 }}>{value}%</Typography>
      </Box>
    </Box>
    <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#828282' }}>{label}</Typography>
  </Box>
);

export default Dashboard;
