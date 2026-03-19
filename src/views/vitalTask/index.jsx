import { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Grid, CircularProgress, Alert, Stack, Paper } from '@mui/material';
import TaskFormDialog from '../../components/TaskFormDialog';
import TaskCard from '../../components/TaskCard';
import { getTasks, updateTaskStatus } from '../../services/taskServices';

const VitalTask = () => {
const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const fetchVitalTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks({ priority: 'High' }); 
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err || 'Failed to load vital tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVitalTasks();
  }, [fetchVitalTasks]);

  const handleToggleComplete = async (taskId) => {
    try {
      await updateTaskStatus(taskId, 'Completed');
      fetchVitalTasks(); // Refresh the list
    } catch (err) { 
      alert(err || 'Update failed'); 
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 } }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1, bgcolor: '#FF5A5F', borderRadius: 2, color: 'white', display: 'flex' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', px: 1 }}>!</Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Vital Tasks</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
                You have {tasks.length} critical tasks that require immediate attention.
              </Typography>
              
              <Stack spacing={2}>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskCard
                      key={task._id} 
                      task={task} 
                      onEdit={() => { setEditingTask(task); setOpenForm(true); }}
                      onToggleComplete={handleToggleComplete}
                      onDelete={fetchVitalTasks}
                    />
                  ))
                ) : (
                  <Typography sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                    No high priority tasks found. Good job!
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>
          
          {/* Side Info Panel */}
          <Grid item xs={12} md={3}>
             <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#FFF5F5', border: '1px solid #FFDADA' }}>
                <Typography variant="h6" color="error" gutterBottom>Priority Tip</Typography>
                <Typography variant="body2">
                  Vital tasks are filtered by "High" priority. Focus on completing these first to maintain your project velocity.
                </Typography>
             </Paper>
          </Grid>
        </Grid>
      )}

      <TaskFormDialog
        open={openForm} 
        task={editingTask} 
        onClose={() => setOpenForm(false)} 
        onSuccess={() => { setOpenForm(false); fetchVitalTasks(); }} 
      />
    </Box>
  );
};

export default VitalTask;