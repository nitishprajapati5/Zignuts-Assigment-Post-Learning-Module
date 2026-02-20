import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import DashboardHeader from './dashboard/DashboardHeader';
import { exportTasksToCSV } from '../Utils/exportCSV';
import TaskGrid from './dashboard/TaskGrid';
import DashboardCards from './DashboardCards';
import SearchComponent from "./SearchComponent"
import { useTasks } from './hooks/useTasks';
import TaskFilters from './dashboard/TaskFilters';





export default function Dashboard() {
  const location = useLocation();
  const { auth } = useSelector((state) => state.auth);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMsg, setAlertMsg] = useState('Task List Updated Successfully!');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isCSVLoading, setCSVLoading] = useState(false);

  const { tasksList, isLoading } = useTasks(statusFilter, dateFilter);

  useEffect(() => {
    if (location.state?.message) {
      setAlertMsg(location.state.message);
      setOpenSnackbar(true);
    }
  }, [location.state]);

  const handleExport = async () => {
    setCSVLoading(true);
    exportTasksToCSV(tasksList);
    setCSVLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <DashboardHeader
        openSnackbar={openSnackbar}
        alertMsg={alertMsg}
        onCloseSnackbar={(_, reason) => reason !== 'clickaway' && setOpenSnackbar(false)}
      />

      <SearchComponent />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Typography variant="h6">
          <Box component="span" sx={{ opacity: 0.7 }}>Hi, </Box>
          <Box component="span" sx={{ fontWeight: 700 }}>{auth?.data?.email}</Box>
        </Typography>
        {auth.data.role === 'admin' && (
          <Button disabled={isCSVLoading} variant="contained" sx={{ textTransform: 'none', borderRadius: 2, px: 3 }} onClick={handleExport}>
            {isCSVLoading ? 'Exporting CSV...' : 'Export to CSV / Excel'}
          </Button>
        )}
      </Box>

      {auth.data.role === 'admin' && <DashboardCards />}

      <TaskFilters
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onStatusChange={(val) => { setStatusFilter(val); setPage(1); }}
        onDateChange={(val) => { setDateFilter(val); setPage(1); }}
      />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 1 }}>
        <TaskGrid tasksList={tasksList} isLoading={isLoading} page={page} onPageChange={(_, val) => setPage(val)} />
      </Container>
    </Container>
  );
}