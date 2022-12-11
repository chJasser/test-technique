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
import { changeForm, login, setLoggedInUser } from "../redux/silces/AuthSilce";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "../../axiosInstance.js";
import { Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const theme = createTheme();

const validationSchema = yup.object({
  password: yup
    .string()
    .required("password is required")
    .min(6, "Password must contain at least 6 characters")
    .matches(/\d/, "Password must contain a number"),
  password2: yup
    .string()
    .required("confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function RegisterFirstTime() {
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const search = useLocation().search;
  const dispatch = useDispatch();

  useEffect(() => {
    setToken(new URLSearchParams(search).get("token"));
    setId(new URLSearchParams(search).get("id"));
  }, [search]);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      password: "",
      password2: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios
        .put(`/auth/setpassword/${id}`, values, config)
        .catch((err) => {
          if (err && err.response) {
            setErrors(err.response.data.message);
            setSuccess(null);
          }
        });
      if (response && response.data) {
        setErrors(null);
        setSuccess(response.data.message);
        dispatch(login(response.data.token));
        const decoded = jwt_decode(response.data.token);

        dispatch(setLoggedInUser(decoded));
        setTimeout(() => {
          navigate("/tache");
        }, 500);
        formik.resetForm();
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {errors && <Alert severity="warning">{errors ? errors : ""}</Alert>}
        {success && (
          <Alert severity="success">{success ? success : ""}</Alert>
        )}{" "}
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
              id="password"
              label="Passowrd"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password2"
              label="Confirm Password"
              name="password2"
              type="password"
              value={formik.values.password2}
              onChange={formik.handleChange}
              error={
                formik.touched.password2 && Boolean(formik.errors.password2)
              }
              helperText={formik.touched.password2 && formik.errors.password2}
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
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
