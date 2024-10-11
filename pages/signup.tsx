import { Divider, TextField, Typography, Box } from '@mui/material';
import AuthenticationLayout from '@components/Authentication/AuthenticationLayout';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import NextLink from 'next/link';
import GradientButton from '@components/Common/CustomButton';
import GoogleLoginButton from '@components/Authentication/GoogleLoginButton';

const EmailSignupDivider = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
      <Divider sx={{ flexGrow: 1, mr: 1 }} />
    </Box>
  );
};

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  return (
    <Box sx={{ maxWidth: 360, m: 'auto' }}>
      <Typography variant="h6" component="h1" gutterBottom>
        Sign up
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Register to manage your tickets, host salons and access our community.
      </Typography>
      <TextField
        fullWidth
        id="email"
        label="Email"
        variant="outlined"
        margin="normal"
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      <GradientButton fullWidth variant="contained"
        onClick={() => signIn('email', { email, callbackUrl: '/' })}
        sx={{ mt: 2, mb: 2 }}
      >
        Get started
      </GradientButton>

      <Typography textAlign="center">
        <NextLink href="/signin" passHref>
          Already have an account? <span style={{ fontWeight: 'bold ' }}>Log in</span>
        </NextLink>
      </Typography>

      <EmailSignupDivider />

      <GoogleLoginButton callbackUrl={''} />
    </Box >
  );
};

const SignUp = () => {
  return (
    <AuthenticationLayout>
      <SignUpForm />
    </AuthenticationLayout>
  );
}

export default SignUp