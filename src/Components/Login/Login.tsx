import { Grid, Stack, TextField, Typography, Button } from "@mui/material";
import { Field, FormikProvider, Form } from "formik";
import loginImage from "../../assets/login.png";
import logo from "../../assets/logo.png";
import "./Login.scss";

function Login({ formik }: any) {
  return (
    <Grid container className="login-container">
      <Grid className="image-panel">
        <img src={loginImage} alt="Login" height="344px" width="467px" />
      </Grid>
      <Grid className="form-panel">
        <Grid className="form-card">
          <FormikProvider value={formik}>
            <Stack className="form-content" component={Form}>
              <img
                src={logo}
                alt="logo"
                height="33px"
                width="134.74px"
                className="login-logo"
              />

              <Typography className="login-title">Login</Typography>
              <Typography className="login-subtitle">
                Use your company provided Login credentials
              </Typography>

              <Stack className="input-group">
                <Typography className="input-label">User ID</Typography>
                <Field name="userId">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter User ID"
                      variant="outlined"
                      className="form-input"
                      onChange={(e) => {
                        const trimmedValue = e.target.value.trim();
                        formik.setFieldValue(field.name, trimmedValue);
                      }}
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Stack>

              <Stack className="input-group">
                <Typography className="input-label">Password</Typography>
                <Field name="password">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="password"
                      placeholder="Enter Password"
                      variant="outlined"
                      className="form-input"
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Stack>

              <Typography className="forgot-password">
                Forgot password?
              </Typography>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                className="login-button"
              >
                Login
              </Button>
            </Stack>
          </FormikProvider>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Login;
