import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader({ openSnackbar, alertMsg, onCloseSnackbar }) {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={onCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={onCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
      <Box>
        <Typography variant="h4" fontWeight="800" color="primary.main">Dashboard</Typography>
        <Typography variant="body1" color="text.secondary">Manage and track your team's progress</Typography>
      </Box>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/task/create')} sx={{ borderRadius: 2, px: 3, py: 1, boxShadow: 2 }}>
        New Task
      </Button>
    </Box>
  );
}