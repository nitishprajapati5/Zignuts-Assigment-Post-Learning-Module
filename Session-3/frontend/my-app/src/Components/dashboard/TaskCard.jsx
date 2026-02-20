import { Card, CardContent, CardActions, Box, Chip, Typography, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteTask } from '../../Store/TaskSlice/taskSlice';
import dayjs from 'dayjs';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in-progress': return 'warning';
    default: return 'default';
  }
};

export default function TaskCard({ task }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Card elevation={0} sx={{ borderRadius: 3, width: '100%', borderColor: 'divider', transition: '0.3s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)', borderColor: 'primary.light' } }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Chip label={task.status || 'pending'} size="small" color={getStatusColor(task.status)} sx={{ fontWeight: 'bold', textTransform: 'capitalize' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">{task.dueDate ? dayjs(task.dueDate).format('MMM D, YYYY') : 'No date'}</Typography>
          </Box>
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>{task.title}</Typography>
        <Typography variant="body2" color="text.secondary"
          sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '40px' }}>
          {task.description || 'No description provided.'}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
        <Typography variant="caption" color="primary" fontWeight="600"
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '50px' }}>
          Assigned to: {task.assignedUserDetails?.email || 'Unassigned'}
        </Typography>
        <Box>
          <Tooltip title="Edit Task">
            <IconButton onClick={() => navigate(`/edit/${task.id}`)} size="small" color="inherit"><EditIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Delete Task">
            <IconButton onClick={() => dispatch(deleteTask(task.id))} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}