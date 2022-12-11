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
import { useDispatch, useSelector } from "react-redux";
import { changeForm, emailValue, login, resetPassword, resetPasswordBooelan, setEmail } from "../redux/silces/AuthSilce";
import * as yup from "yup";
import axios from "../../axiosInstance.js";
import { useFormik } from "formik";
import { Alert } from "@mui/material";
const theme = createTheme();

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ResetPasswordForm() {
  const isChecked = useSelector(resetPasswordBooelan);

  const ResetPassword = () => {
  
    const [errors, setErrors] = React.useState(null);
    const dispatch = useDispatch();
    const formik = useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        const response = await axios
          .put(`/auth/resetpassword/${values.email}`)
          .catch((err) => {
            if (err && err.response) {
              setErrors(err.response.data.message);
              dispatch(resetPassword(err.response.data.success));
          
            }
          });
        if (response && response.data) {
         
          setErrors(null);
          dispatch(resetPassword(response.data.success));
      
          dispatch(setEmail(response.data.email));
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
              Reset Password
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
                id="email"
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Next
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    onClick={() => {
                      dispatch(changeForm("signin"));
                    }}
                    variant="body2"
                  >
                    Sign In ?
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
        </Container>
       
      </ThemeProvider>
    );
  };

  const Changepassword = () => {
    const email = useSelector(emailValue);
    const validationSchema = yup.object({
      code: yup.string()
        .required("code is required")
        .length(8, "Recuperation code must contain 8 characters"),
      password: yup.string()
        .required("password is required")
        .min(6, "Password must contain at least 6 characters")
        .matches(/\d/, "Password must contain a number"),
      confirmPassword: yup.string()
        .required("confirm password is required")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    });

    const [errors, setErrors] = React.useState(null);
    const [success, setSuccess] = React.useState(null);
    const dispatch = useDispatch();
    const formik = useFormik({
      initialValues: {
        code: "",
        password:"",
        confirmPassword: "",

      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
       
        const user = {
          email: email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          code: values.code
        };
        axios
          .put("/auth/changepassword", user)
          .then((res) => {
            setErrors(null);
            setSuccess(res.data.message);
            dispatch(login(res.data.token));
            dispatch(resetPassword(false));
            dispatch(changeForm("signin"));
            dispatch(setEmail(null));
           
            // setTimeout(() => { history.push("/mi") }, 1000)
          })
          .catch((err) => {
            setErrors(err.response.data.message);
            setSuccess(null);
         
          });
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
              Reset Password
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
                id="code"
                fullWidth
                label="Confirmation code"
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
                autoFocus
                type="text"
       
              />
              <TextField
                  required
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
                <TextField
                  required
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
                  }
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  autoComplete="new-password"
                />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    onClick={() => {
                      dispatch(changeForm("signin"));
                    }}
                    variant="body2"
                  >
                    Sign In ?
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
        </Container>
       
      </ThemeProvider>
    );
  };
  return (
    <>{isChecked ? <Changepassword /> : <ResetPassword />}</>
  );
}
