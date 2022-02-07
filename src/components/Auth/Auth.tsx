import React, { useState } from "react";
import logo from '../../assets/cropped.jpg';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { loginRequest } from "helpers/requests";
import { tokenStore } from 'helpers/auth';
import Alert from "@mui/material/Alert";
import Reaptcha from 'reaptcha';

type TToken = {
  [key: string]: string;
};

type TTokenErrors = {
  non_field_errors: string[];
}

type TAuthProps = {
  onAuth: (arg: string) => void
}

const isToken = (argToken: unknown): argToken is TToken => {
  return typeof argToken === 'object';
}

export const Auth:React.FC<TAuthProps> = ({ onAuth }: TAuthProps) => {
  const [login, setLogin] = useState('');
  const [verifed, setVerifed] = useState(false);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[] | never>([]);

  const handleSubmit = async (e: React.SyntheticEvent<EventTarget>)  => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) {
      return;
    }
    const { login, password } = e.target;
    const token = await loginRequest({username: login.value, password: password.value});
    if(isToken(token) && token.key) {
      await (await tokenStore).setToken(token.key);
      onAuth(token.key);
    } else {
      const errorsArray = (token as TTokenErrors).non_field_errors;
      setErrors(errorsArray);
    }
  }

  const computedDisableButton = () => {
    if (login.length >= 3 && password.length >= 3 && verifed) {
      return false
    }
    return true;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'login':
        setLogin(e.target.value)
        break;
      case 'password':
        setPassword(e.target.value)
        break;
      default:
        break;
    }
  }

  const onVerify = () => {
    setVerifed(true)
  }


  return <Container maxWidth="xl">
  <Grid
    alignItems="center"
    justifyContent="center"
    style={{ display: 'flex', minHeight: "100vh" }}
  >
    <Paper className={"login"} elevation={3}>
      <img className="logo" src={logo} alt="logo of company" />
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="login"
        label="Login"
        name="login"
        autoComplete="login"
        autoFocus
        onChange={handleChange}
      />
      <TextField
        sx={{ mb: 2 }}
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange={handleChange}
      />
      <Reaptcha sitekey="6Lf99cEdAAAAAKy8sIpUH2i_v3mZDk4frV2wLsIK" onVerify={onVerify} />
      <Button
        disabled={computedDisableButton()}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
      {errors?.length ? errors.map(el => {
        return <Alert sx={{ mb: 2 }} key={el} severity="error">{el}</Alert>
      }) : null}
      </Box>
    </Paper>
  </Grid>
</Container>
}