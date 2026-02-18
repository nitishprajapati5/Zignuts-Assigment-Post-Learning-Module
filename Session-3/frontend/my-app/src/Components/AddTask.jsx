import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Utils/axios';
import { useEffect, useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function AddTask() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // store fetched users

  const { handleSubmit, register, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      dueDate: null,
      assignedTo: '',
    },
  });

  // Fetch all users once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await axiosInstance.get("/api/users", { withCredentials: true });
        setUsers(resp.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []); // empty dependency array → fetch once

  const onSubmit = async (data) => {
    console.log(data)
    const payload = {
      ...data,
      dueDate:data.dueDate ? data.dueDate.toDate() : null
    }
    console.log(payload)
    // setLoading(true);
    // try {
    //   const payload = {
    //     ...data,
    //     dueDate: data.dueDate ? data.dueDate.toDate() : null, // convert Dayjs to JS Date
    //   };

    //   const response = await axiosInstance.post('/api/tasks', payload, { withCredentials: true });
    //   console.log('Task created:', response.data);

    //   reset();
    //   setLoading(false);
    //   navigate('/dashboard');
    // } catch (err) {
    //   console.error(err);
    //   setLoading(false);
    // }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card sx={{ minWidth: 400, p: 3 }}>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <Typography variant="h5" component="h1">
              Add Task
            </Typography>

            {/* Title */}
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              {...register('title', { required: 'Task title is required' })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            {/* Description */}
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              {...register('description', { required: 'Description is required' })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            {/* Status */}
            <TextField
              select
              label="Status"
              defaultValue="pending"
              {...register('status', { required: 'Status is required' })}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>

            {/* Due Date */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dueDate"
                control={control}
                rules={{ required: 'Due date is required' }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Due Date"
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dueDate,
                        helperText: errors.dueDate?.message,
                      },
                    }}
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
            </LocalizationProvider>

            {/* Assigned To Dropdown */}
            <TextField
              select
              label="Assign To"
              fullWidth
              defaultValue=""
              {...register('assignedTo', { required: 'Assigned user is required' })}
              error={!!errors.assignedTo}
              helperText={errors.assignedTo?.message}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name || user.email}
                </MenuItem>
              ))}
            </TextField>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
            >
              {!isLoading ? 'Create Task' : 'Creating Task...'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddTask;
