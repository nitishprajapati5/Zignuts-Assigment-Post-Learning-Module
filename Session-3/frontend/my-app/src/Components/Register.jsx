import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate()

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ minWidth: 350, p: 3 }}>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Typography variant="h5" component="h1">
              Welcome to Task Manager!
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Please login to continue
            </Typography>

            <Box>
              <Typography sx={{ mb: 1 }}>Email</Typography>
              <TextField
                fullWidth
                type="text"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Box>

            <Box>
              <Typography sx={{ mb: 1 }}>Password</Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Box>

            <Button type="submit" variant="contained" fullWidth>
              Register
            </Button>
            <Button onClick={() => navigate("/")} type="submit" variant="contained" fullWidth>
              Already have an Account? Register 
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
