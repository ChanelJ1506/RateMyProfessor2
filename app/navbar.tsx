import React from 'react';
import { Box, Button, IconButton, Drawer, List, ListItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleLogin = () => router.push('/sign-in');
  const handleSignUp = () => router.push('/sign-up');
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await signOut();
      router.push('/sign-in');
    }
  };

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#f5f5f5',
      }}
    >
      <List>
        {!user ? (
          <>
            <ListItem>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: '#5e35b1',
                  color: '#5e35b1',
                  '&:hover': {
                    borderColor: '#512da8',
                    color: '#512da8',
                  },
                }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#5e35b1',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#512da8',
                  },
                }}
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem>
              <Box
                sx={{
                  backgroundColor: 'transparent',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #ffffff', 
                }}
              >
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                  {user.primaryEmailAddress?.emailAddress}
                </Typography>
              </Box>
            </ListItem>
            <ListItem>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: '#e53935',
                  color: '#e53935',
                  '&:hover': {
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                  },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      bgcolor="transparent"
      color="#000000" 
      zIndex={1000}
      p={2}
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
    >
      <Box
        maxWidth="1200px"
        margin="0 auto"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center">
          <Image
            src="/images/logo-RateMyProfAi.png"
            alt="Rate My Professor Logo"
            width={isMobile ? 100 : 150}
            height={isMobile ? 100 : 150}
          />
        </Box>
        {isMobile ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              flexGrow: 1,
            }}
          >
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              sx={{
                color: '#000000', 
                fontSize: '2rem',
                position: 'absolute',
                right: 30,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={openDrawer}
              onClose={toggleDrawer}
              sx={{
                '& .MuiDrawer-paper': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              {drawerContent}
            </Drawer>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={2}>
            {!user ? (
              <>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#5e35b1',
                    color: '#5e35b1',
                    '&:hover': {
                      borderColor: '#512da8',
                      color: '#512da8',
                    },
                  }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#5e35b1',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#512da8',
                    },
                  }}
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    backgroundColor: 'transparent',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #ffffff', 
                    marginRight: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    {user.primaryEmailAddress?.emailAddress}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#e53935',
                    color: '#e53935',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                    },
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}


















