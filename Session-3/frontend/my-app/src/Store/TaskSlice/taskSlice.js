import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axios";

export const fetchTask = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/tasks",{withCredentials:true});
      console.log(response)
      return response.data; 
    } catch (error) {
      // Extract the error message for the state
      return rejectWithValue(error.response?.data || "Failed to fetch");
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async(_,{rejectWithValue}) => {
   try {
     const response = await axiosInstance.post("/api/tasks",{},{withCredentials:true});
      console.log(response)
      return response.data
   } catch (error) {
      return rejectWithValue("Failed to Add Task")
   }
  }
)

const taskSlice = createSlice({
  name: "tasks",
  initialState: { 
    items: [], 
    status: 'idle', 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addTask.pending,(state) => {
        state.status = "loading";
        state.error = null
      })
      .addCase(addTask.fulfilled,(state,action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      }).
      addCase(addTask.rejected,(state,action) => {
        state.status = "failed"
        state.error = action.payload
      })
  }
});

export default taskSlice.reducer;