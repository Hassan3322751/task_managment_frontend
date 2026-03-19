import apiInstance from "../libs/axios";

export const getDashboardData = async () => {
  const res = await apiInstance.get("/tasks/dashboard/stats");
  return res.data;
};

export const updateTaskStatus = async (id, status) => {
  const res = await apiInstance.put(`/tasks/${id}`, { status });
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await apiInstance.delete(`/tasks/${id}`);
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await apiInstance.post('/tasks', taskData);
  return res.data;
};

export const updateTask = async (id, taskData) => {
  const res = await apiInstance.put(`/tasks/${id}`, taskData);
  return res.data;
};

export const getTasks = async (params) => {
  const res = await apiInstance.get("/tasks", { params });
  return res.data;
};

export const getTaskById = async (id) => {
  const res = await apiInstance.get(`/tasks/${id}`);
  return res.data;
};