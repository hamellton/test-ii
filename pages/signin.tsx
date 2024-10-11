import { Divider, TextField, Typography, Box } from '@mui/material';
import AuthenticationLayout from '@components/Authentication/AuthenticationLayout';
import GoogleLoginButton from '@components/Authentication/GoogleLoginButton';
import SignInButton from "@components/Authentication/SignInButton"
import { useRouter } from 'next/router';
import { useState } from 'react';

const EmailSignInDivider = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
      <Divider sx={{ flexGrow: 1, mr: 1 }} />
      <Typography variant="caption" color="textSecondary">
        Or sign in with e-mail
      </Typography>
      <Divider sx={{ flexGrow: 1, ml: 1 }} />
    </Box>
  );
};

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const router = useRouter()
  // Determine the callback URL based on the presence of the 'from' query parameter
  const callbackUrl = router.query.callback? router.query.callback[0] : '/';

  return (
    <Box sx={{ maxWidth: 360, m: 'auto' }}>
      <Typography variant="h6" component="h1" gutterBottom>
        Sign in
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Manage your tickets and membership, host salons, and access our community.
      </Typography>

      <GoogleLoginButton callbackUrl={callbackUrl}/>

      <EmailSignInDivider />

      <TextField
        fullWidth
        id="email"
        label="Email"
        variant="outlined"
        margin="normal"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <SignInButton email={email} callbackUrl={callbackUrl} text='Send Magic Link'/>
    </Box>
  );
};

const SignIn = () => {
  return (
    <AuthenticationLayout>
      <SignUpForm />
    </AuthenticationLayout>
  );
}

export default SignIn