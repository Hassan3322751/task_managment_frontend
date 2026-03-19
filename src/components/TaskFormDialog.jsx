import { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";
import {
  createTask,
  updateTask,
} from "../services/taskServices";
import { uploadImage } from "../services/uploadService";

const TaskFormDialog = ({ open, task, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Not Started",
    priority: "Moderate",
    dueDate: "",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Not Started",
        priority: task.priority || "Moderate",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        imageUrl: task.imageUrl || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        status: "Not Started",
        priority: "Moderate",
        dueDate: "",
        imageUrl: "",
      });
    }
  }, [task, open]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm({ ...form, imageUrl: url }); // Update form with Cloudinary URL
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (task) {
        await updateTask(task._id, form);
      } else {
        await createTask(form);
      }
      onSuccess(); // Triggers the dashboard refresh
    } catch (err) {
      alert(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: "20px", p: 4 } }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -4,
              left: 0,
              width: "100%",
              height: "3px",
              bgcolor: "#FF5A5F",
            },
          }}
        >
          {task ? "Edit Task" : "Add New Task"}
        </Typography>
        <Button
          onClick={onClose}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Go Back
        </Button>
      </Box>

      <Box
        sx={{ mt: 4, border: "1px solid #E0E0E0", borderRadius: "12px", p: 4 }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Title
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter task title"
          variant="outlined"
          sx={{ mb: 3 }}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Date
            </Typography>
            <TextField
              type="date"
              fullWidth
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Status
            </Typography>
            <RadioGroup
              row
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <FormControlLabel
                value="Pending"
                control={
                  <Radio
                    sx={{
                      color: "#FF5A5F",
                      "&.Mui-checked": { color: "#FF5A5F" },
                    }}
                  />
                }
                label="Pending"
              />
              <FormControlLabel
                value="In Progress"
                control={
                  <Radio
                    sx={{
                      color: "#2196F3",
                      "&.Mui-checked": { color: "#2196F3" },
                    }}
                  />
                }
                label="In Progress"
              />
              <FormControlLabel
                value="Completed"
                control={
                  <Radio
                    sx={{
                      color: "#4CAF50",
                      "&.Mui-checked": { color: "#4CAF50" },
                    }}
                  />
                }
                label="Completed"
              />
            </RadioGroup>
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Priority
        </Typography>
        <RadioGroup
          row
          sx={{ mb: 3 }}
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <FormControlLabel
            value="High"
            control={<Radio sx={{ color: "#FF5A5F" }} />}
            label={
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    w: 8,
                    h: 8,
                    borderRadius: "50%",
                    bgcolor: "#FF5A5F",
                    mr: 1,
                  }}
                />{" "}
                High
              </Typography>
            }
          />
          <FormControlLabel
            value="Medium"
            control={<Radio sx={{ color: "#2196F3" }} />}
            label={
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    w: 8,
                    h: 8,
                    borderRadius: "50%",
                    bgcolor: "#2196F3",
                    mr: 1,
                  }}
                />{" "}
                Medium
              </Typography>
            }
          />
          <FormControlLabel
            value="Low"
            control={<Radio sx={{ color: "#4CAF50" }} />}
            label={
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    w: 8,
                    h: 8,
                    borderRadius: "50%",
                    bgcolor: "#4CAF50",
                    mr: 1,
                  }}
                />{" "}
                Low
              </Typography>
            }
          />
        </RadioGroup>

        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Task Description
            </Typography>
            <TextField
              multiline
              rows={6}
              fullWidth
              placeholder="Start writing here...."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Upload Image
            </Typography>

            {/* Wrap the Box in a 'label' to make the whole area clickable for the hidden input */}
            <Box
              component="label"
              sx={{
                border: "1px dashed #E0E0E0",
                borderRadius: "12px",
                height: "165px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#F9F9F9",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                "&:hover": { bgcolor: "#F0F0F0" },
              }}
            >
              {/* THE HIDDEN INPUT */}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />

              {uploading ? (
                <CircularProgress size={30} sx={{ color: "#FF5A5F" }} />
              ) : form.imageUrl ? (
                <>
                  <img
                    src={form.imageUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt="Preview"
                  />
                  {/* Delete Button to clear image */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent opening file picker
                      setForm({ ...form, imageUrl: "" });
                    }}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      bgcolor: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <CloudUpload sx={{ fontSize: 40, color: "#999", mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Click to upload image
                  </Typography>
                </>
              )}
            </Box>

            <TextField
              fullWidth
              size="small"
              placeholder="Or paste image URL"
              sx={{ mt: 1 }}
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            bgcolor: "#FF5A5F",
            px: 6,
            py: 1.5,
            borderRadius: "10px",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: "#e04f54" },
          }}
        >
          Done
        </Button>
      </Box>
    </Dialog>
  );
};

export default TaskFormDialog;
