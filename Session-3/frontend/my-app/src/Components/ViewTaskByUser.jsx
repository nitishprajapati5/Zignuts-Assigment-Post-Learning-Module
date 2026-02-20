import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Box,
    CircularProgress,
    List,
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText
} from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from '../Utils/axios';
import { db } from '../Utils/firebase';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { collection, getDocs, query, where } from 'firebase/firestore';

function ViewTaskByUser() {
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [isLoading, setLoading] = useState(false)
    const [isTask, setTaskLoading] = useState(false)
    const [tasks, setTasks] = useState([])

    const handleDialogOpen = () => setOpen(true);
    const handleDialogClose = () => {
        setOpen(false);
        setSelectedUser(null);
        setTasks([]);
    };

    useEffect(() => {
        if (!open) return;

        setLoading(true)

        const fetchUsers = async () => {
            try {
                const response = (await axiosInstance.get('/api/users')).data;
                console.log(response.users);
                setUserData(response.users);
                setLoading(false)
            } catch (error) {
                console.error(error);
                setLoading(false)
            }
        };

        fetchUsers();
    }, [open]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!selectedUser) return;

            try {
                setTaskLoading(true);

                const taskRef = collection(db, "tasks");
                const taskQuery = query(taskRef, where("assignedTo", "==", selectedUser));

                const querySnapshot = await getDocs(taskQuery);

                const tasks = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log(tasks);
                setTasks(tasks);

            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setTaskLoading(false);
            }
        };

        fetchTasks();
    }, [selectedUser]);

    return (
        <>
            <Button variant="contained" onClick={handleDialogOpen}>
                View Tasks by Users
            </Button>


            <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ p: 4 }}>View By Users</DialogTitle>
                <DialogContent>
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="120px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TextField
                            select
                            fullWidth
                            label="Select User"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            {userData.length > 0 ? (
                                userData.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.email}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No users found</MenuItem>
                            )}
                        </TextField>
                    )}

                    {isTask ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="120px">
                            <CircularProgress />
                        </Box>

                    ) : !selectedUser ? (

                        <Box textAlign="center" py={2}>
                            <p>Select User to View the Task</p>
                        </Box>

                    ) : tasks.length === 0 ? (

                        <Box textAlign="center" py={2}>
                            <p>No Tasks Found</p>
                        </Box>

                    ) : (

                        <List sx={{ width: '100%' }}>
                            {tasks.map((task) => (
                                <ListItem key={task.id}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <TaskAltIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={task.title}
                                        secondary={
                                            task.createdAt?.toDate?.().toLocaleDateString() || "No date"
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                    )}


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ViewTaskByUser;
