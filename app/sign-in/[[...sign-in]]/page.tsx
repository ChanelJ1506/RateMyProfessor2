"use client";
import { SignIn } from "@clerk/nextjs";
import { Button, Container, Typography, Box, Paper } from "@mui/material";
import StarsCanvas from "../../../components/starbg";
import Navbar from "../../navbar";
import styles from "../../../styles/Home.module.css";

export default function SignInPage() {
  return (
    <Box className={styles.main}>
      <Navbar />
      <StarsCanvas className={styles.starsCanvas} />

      <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: 0 }}>
        <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Sign In
          </Typography>
          <Box sx={{ width: '100%' }}>
            <SignIn
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  card: "sign-in-card",
                  formButton: "sign-in-button",
                  input: "sign-in-input",
                },
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}




