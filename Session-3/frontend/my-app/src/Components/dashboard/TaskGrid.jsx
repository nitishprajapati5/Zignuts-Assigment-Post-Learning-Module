import { Grid, Box, Typography, CircularProgress, Pagination } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import TaskCard from './TaskCard';

const ROW_PER_PAGE = 10;

export default function TaskGrid({ tasksList, isLoading, page, onPageChange }) {
  const totalPages = Math.ceil(tasksList.length / ROW_PER_PAGE);
  const paginated = tasksList.slice((page - 1) * ROW_PER_PAGE, page * ROW_PER_PAGE);

  if (isLoading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
      <CircularProgress thickness={4} size={50} />
      <Typography sx={{ mt: 2 }} color="text.secondary">Updating tasks...</Typography>
    </Box>
  );

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {paginated.length > 0
          ? paginated.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <TaskCard task={task} />
              </Grid>
            ))
          : (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 8, opacity: 0.6 }}>
              <TaskAltIcon sx={{ fontSize: 60, mb: 2, color: 'divider' }} />
              <Typography variant="h6">No tasks found</Typography>
              <Typography variant="body2">Click "New Task" to get started.</Typography>
            </Box>
          )}
      </Grid>
      {tasksList.length > ROW_PER_PAGE && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={totalPages} page={page} onChange={onPageChange} color="primary" />
        </Box>
      )}
    </>
  );
}