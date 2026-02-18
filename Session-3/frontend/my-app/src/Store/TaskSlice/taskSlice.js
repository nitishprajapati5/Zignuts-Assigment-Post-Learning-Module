import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axios";

export const fetchTask = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/tasks", { withCredentials: true });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch");
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/tasks", payload, { withCredentials: true });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to Add Task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = payload; 
      const response = await axiosInstance.put(
        `/api/tasks/${id}`, 
        updateData, 
        { withCredentials: true }
      );
      return response.data.task; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to Update Task");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask", 
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/tasks/${id}`, { withCredentials: true });
      return id; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to Delete Task");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: { 
    items: { tasksWithOwner: [] }, 
    status: 'idle', 
    error: null 
  },
  reducers: {
    resetTaskStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; 
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(addTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.tasksWithOwner.push(action.payload.task); 
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateTask.fulfilled,(state,action) => {
        state.status = 'succeeded';
        const index = state.items.tasksWithOwner.findIndex(
          (task) => task.id === action.payload.id
        )
        if(index !== -1){
          state.items.tasksWithOwner[index] = action.payload
        }
      })

      .addCase(updateTask.rejected,(state,action) => {
        state.status = "failed";
        state.error = action.payload
      })
      .addCase(updateTask.pending,(state) => {
        state.status = "loading"
      })

      .addCase(deleteTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.tasksWithOwner = state.items.tasksWithOwner.filter(
          (task) => (task.id || task._id) !== action.payload
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;