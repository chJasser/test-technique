import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import axios from "../../axiosInstance.js";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { changeForm } from "../redux/silces/AuthSilce";
import { useFormik } from "formik";
import * as yup from "yup";

import { Alert } from "@mui/material";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("First name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "Password must contain at least 6 characters")
    .matches(/\d/, "Password must contain a number"),
  password2: yup
    .string()
    .required("confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  phoneNumber: yup
    .string()
    .required("phone number is required")
    .matches(phoneRegExp, "Phone number is not valid"),
});

const theme = createTheme();

function SignupForm() {
  const dispatch = useDispatch();
  const [errors, setErrors] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

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
      const response = await axios
        .post("/auth/register", values)
        .catch((err) => {
          if (err && err.response) {
            setErrors(err.response.data.message);
            setSuccess(null);
          }
        });
      if (response && response.data) {
        setErrors(null);
        setTimeout(() => dispatch(changeForm("signin")), 3000);
        setSuccess(response.data.message);
        formik.resetForm();
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {errors && <Alert severity="warning">{errors ? errors : ""}</Alert>}
        {success && <Alert severity="success">{success ? success : ""}</Alert>}
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="first_name"
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  autoFocus
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.first_name &&
                    Boolean(formik.errors.first_name)
                  }
                  helperText={
                    formik.touched.first_name && formik.errors.first_name
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.last_name && Boolean(formik.errors.last_name)
                  }
                  helperText={
                    formik.touched.last_name && formik.errors.last_name
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="password2"
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  value={formik.values.password2}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password2 && Boolean(formik.errors.password2)
                  }
                  helperText={
                    formik.touched.password2 && formik.errors.password2
                  }
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  type="text"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.phoneNumber &&
                    Boolean(formik.errors.phoneNumber)
                  }
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  onClick={() => {
                    dispatch(changeForm("signin"));
                  }}
                >
                  Already have an account? Sign in
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
export default SignupForm;
