import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { changeForm, login } from "../redux/silces/AuthSilce";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "../../axiosInstance.js";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "Password must contain at least 6 characters")
    .matches(/\d/, "Password must contain a number"),
});

export default function SigninForm() {
  const dispatch = useDispatch();
  const [errors, setErrors] = React.useState(null);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password2: "",
      password: "",
      phoneNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await axios.post("/auth/login", values).catch((err) => {
        if (err && err.response) {
          setErrors(err.response.data.message);
        }
      });
      if (response && response.data) {
        setErrors(null);
        dispatch(login(response.data.token));
        navigate("/tache");
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {errors && <Alert severity="warning">{errors ? errors : ""}</Alert>}
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  onClick={() => {
                    dispatch(changeForm("resetpassword"));
                  }}
                  variant="body2"
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  onClick={() => {
                    dispatch(changeForm("signup"));
                  }}
                  variant="body2"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <a
            href="http://localhost:5000/auth/github"
            id="github-button"
            className="btn btn-block btn-social btn-github"
          >
            <i className="fa fa-github"></i> Sign in with Github
          </a>
          <a
            href="http://localhost:5000/auth/google"
            id="github-button"
            className="btn btn-block btn-social btn-google"
          >
            <i className="fa fa-google"></i> Sign in with Google
          </a>
        </div>
      </Container>
    </ThemeProvider>
  );
}
