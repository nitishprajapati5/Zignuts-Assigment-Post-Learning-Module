import { Box, TextField, MenuItem } from '@mui/material';
import ViewTaskByUser from '../ViewTaskByUser';

export default function TaskFilters({ statusFilter, dateFilter, onStatusChange, onDateChange }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mr: 2, mt: 4, flexWrap: 'wrap', justifyContent: 'end' }}>
      <ViewTaskByUser />
      <TextField select size="small" label="Filter by Status" value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} sx={{ minWidth: 160 }}>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="in-progress">In Progress</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </TextField>
      <TextField type="date" size="small" label="Filter by Date" value={dateFilter} slotProps={{ inputLabel: { shrink: true } }} onChange={(e) => onDateChange(e.target.value)} />
    </Box>
  );
}