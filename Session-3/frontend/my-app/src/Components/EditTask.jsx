import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Card, CardContent, TextField, Typography, Button,
  MenuItem, CircularProgress, Container, IconButton, Stack
} from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axiosInstance from "../Utils/axios";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../Store/TaskSlice/taskSlice";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { status, items, error } = useSelector((state) => state.tasks); 

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]); 
  const [data, setData] = useState({
    title: "",
    description: "",
    status: "",
    dueDate: null,
    assignedTo: ""
  });

  useEffect(() => {
    async function initData() {
      try {
        const [taskRes, usersRes] = await Promise.all([
          axiosInstance.get(`/api/tasks/${id}`, { withCredentials: true }),
          axiosInstance.get('/api/users', { withCredentials: true })
        ]);

        const task = taskRes.data.task || taskRes.data;
        const fetchedUsers = usersRes.data.users || [];

        setUsers(fetchedUsers);
        
        setData({
          title: task.title || "",
          description: task.description || "",
          status: task.status || "pending",
          dueDate: task.dueDate ? dayjs(task.dueDate) : null,
          assignedTo: task.assignedTo || "" 
        });
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, [id]);

 const handleUpdate = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    const payload = {
      id: id, // Pass the ID inside the payload object
      title: data.title,
      description: data.description,
      status: data.status,
      assignedTo: data.assignedTo,
      dueDate: data.dueDate ? data.dueDate.toISOString() : null
    };

    // Use .unwrap() to catch errors locally or navigate on success
    await dispatch(updateTask(payload)).unwrap();

    navigate("/dashboard", { state: { message: "Task Updated Successfully!" } });     
    
  } catch (err) {
    // This catches the 'rejectWithValue' from your slice
    console.error("Update failed:", err);
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

 


  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
        <Typography variant="h5" fontWeight="bold">Edit Task Details</Typography>
      </Stack>

      <Card elevation={4} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleUpdate} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            <TextField
              label="Task Title"
              fullWidth
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              variant="filled"
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              variant="filled"
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Status"
                fullWidth
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value })}
                variant="filled"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Due Date"
                  value={data.dueDate}
                  onChange={(newValue) => setData({ ...data, dueDate: newValue })}
                  slotProps={{ textField: { variant: 'filled', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Stack>

            <TextField
              select
              label="Assigned To"
              fullWidth
              variant="filled"
              value={data.assignedTo}
              onChange={(e) => setData({ ...data, assignedTo: e.target.value })}
              helperText="Select a user to assign this task"
            >
              {users.map((user) => (
                <MenuItem key={user.id } value={user.id}>
                  {user.email}
                </MenuItem>
              ))}
            </TextField>

            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              disabled={saving}
              sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2, mt: 1 }}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : "Update Task"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default EditTask;