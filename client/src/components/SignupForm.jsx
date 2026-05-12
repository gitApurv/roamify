import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signupUser } from "../api/api";

const SignupForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const handleSignup = async (data) => {
    setLoading(true);
    try {
      const response = await signupUser(data);
      if (!response.ok) {
        throw new Error(response.message);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleSignup)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailOutlineIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        sx={{
          py: 1.2,
          fontWeight: 600,
          fontSize: "1rem",
          textTransform: "none",
          borderRadius: 1,
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
      </Button>
    </Box>
  );
};

export default SignupForm;
