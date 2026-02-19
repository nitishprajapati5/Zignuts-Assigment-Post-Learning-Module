import {
  Box,
  Card,
  Typography,
  Grid,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from '../Utils/axios';


export default function DashboardCards() {
  const [statsData, setStatsData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
 useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await axiosInstance.get('/api/stats');

      setStatsData(response.data.result);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);


  if (isLoading === true) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 10,
        }}
      >
        <CircularProgress thickness={4} size={50} />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Fetching your Stats and Tasks....
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 1 }}>
      {error === true && (
        <Alert sx={{ mb: 1 }} variant="filled" severity="error">
          Something Went Wrong!
        </Alert>
      )}
      <Box>
        <Grid container spacing={2} justifyContent="center">
          {statsData.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  minWidth:"100px",
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.06)',
                    borderColor: 'primary.light',
                  },
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.title}
                </Typography>

                <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                  {item.value}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: 'success.main', fontWeight: 600 }}
                >
                  {item.subtitle}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
