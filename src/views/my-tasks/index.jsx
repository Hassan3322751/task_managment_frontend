import { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Paper, Stack, Pagination, 
  CircularProgress, TextField, FormControl, 
  MenuItem, Select, Button, Grid, 
  InputLabel
} from '@mui/material';
import { FilterListOff } from '@mui/icons-material';

import SideBar from '../../components/SideBar';
import MyTaskCard from '../../components/MyTaskCard';
import TaskFormDialog from '../../components/TaskFormDialog';
import { deleteTask, getTasks, updateTaskStatus } from '../../services/taskServices';

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 8,
        sortBy,
        sortOrder,
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter }),
      };

      const data = await getTasks(params);
      setTasks(data.tasks || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleStatus = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      alert(err);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('dueDate');
    setSortOrder('asc');
    setPage(1);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      <SideBar />
      
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, ml: { md: '20px' } }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>My Tasks</Typography>

        {/* Filters Section */}
      <div className='border p-4'>
        <Paper sx={{ p: 3, borderRadius: '16px', mb: 4, border: '1px solid #E0E0E0', boxShadow: 'none' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField 
                fullWidth size="small" 
                placeholder="Search tasks..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <Select fullWidth size="small" value={statusFilter} displayEmpty onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} md={2}>
              <Select fullWidth size="small" value={priorityFilter} displayEmpty onChange={(e) => setPriorityFilter(e.target.value)}>
                <MenuItem value="">All Priority</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </Grid>
            <FormControl size="small" sx={{ minWidth: 140 }}>
               <InputLabel>Sort By</InputLabel>
               <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              >
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="createdAt">Created Date</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                label="Order"
                onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
            <Grid item xs={12} md={3}>
               <Button 
                startIcon={<FilterListOff />} 
                onClick={resetFilters}
                sx={{ color: '#FF5A5F', fontWeight: 600 }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="error" /></Box>
        ) : (
          <Stack spacing={2}>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <MyTaskCard 
                  key={task._id} 
                  task={task} 
                  onToggleStatus={handleToggleStatus} 
                  onDelete={handleDeleteTask}
                  onEdit={() => { setEditingTask(task); setOpenForm(true); }}
                />
              ))
            ) : (
              <Typography align="center" sx={{ py: 10, color: '#999' }}>No tasks found matching your filters.</Typography>
            )}
          </Stack>
        )}
      </div>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, v) => setPage(v)} 
            sx={{ '& .Mui-selected': { bgcolor: '#FF5A5F !important', color: 'white' } }}
          />
        </Box>
      </Box>

      <TaskFormDialog 
        open={openForm} 
        task={editingTask} 
        onClose={() => setOpenForm(false)} 
        onSuccess={() => { setOpenForm(false); fetchTasks(); }} 
      />
    </Box>
  );
};

export default MyTask;