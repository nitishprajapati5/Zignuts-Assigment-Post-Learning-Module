import { Box, Card, Typography, Grid, Container } from "@mui/material";

const stats = [
  { title: "Users", value: "1,248", subtitle: "+12% this month" },
  { title: "Pending Tasks", value: "$8,540", subtitle: "+8% this week" },
  { title: "Inprogress Task", value: "342", subtitle: "Currently online" },
   { title: "Completed Task", value: "342", subtitle: "Currently online" },

];

export default function DashboardCards() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4,mb:1 }}>
      <Box>
        <Grid container spacing={2} justifyContent="center">
          {stats.map((item, index) => (
            <Grid
              item
              xs={12}     
              sm={6}     
              md={4}      
              key={index}
            >
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 32px rgba(0,0,0,0.06)",
                    borderColor: "primary.light",
                  },
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.title}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ my: 1 }}
                >
                  {item.value}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "success.main", fontWeight: 600 }}
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
