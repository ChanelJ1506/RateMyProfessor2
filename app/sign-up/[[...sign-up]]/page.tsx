"use client";
import { SignUp } from "@clerk/nextjs";
import { Button, Container, Typography, Box, Paper } from "@mui/material";
import StarsCanvas from "../../../components/starbg";
import Navbar from "../../navbar";
import styles from "../../../styles/Home.module.css";

export default function SignUpPage() {
  return (
    <Box className={styles.main}>
      <Navbar />
      <StarsCanvas className={styles.starsCanvas} />

      <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: 0 }}>
        <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Sign Up
          </Typography>
          <Box sx={{ width: '100%' }}>
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  card: "sign-up-card",
                  formButton: "sign-up-button",
                  input: "sign-up-input",
                },
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}


