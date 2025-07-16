import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Container, 
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Stack,
  Divider,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Analytics as AnalyticsIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  Dashboard,
  TrendingUp
} from '@mui/icons-material';
import Home from './pages/Home';
import Stats from './pages/Stats';

// Navigation Item Component
const NavItem = ({ to, icon, label, badge, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Button
      component={Link}
      to={to}
      onClick={onClick}
      color="inherit"
      startIcon={icon}
      sx={{
        mx: 1,
        px: 2,
        py: 1,
        borderRadius: 2,
        textTransform: 'none',
        position: 'relative',
        backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
        '&::after': isActive ? {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: 'white',
        } : {}
      }}
    >
      {badge ? (
        <Badge badgeContent={badge} color="error">
          {label}
        </Badge>
      ) : (
        label
      )}
    </Button>
  );
};

// Mobile Navigation Drawer
const MobileDrawer = ({ open, onClose, navItems }) => {
  const location = useLocation();
  
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: 'primary.main',
          color: 'white'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
              <LinkIcon />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              URL Shortener
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
        
        <List>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <ListItem key={item.to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  onClick={onClose}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ 
                      fontWeight: isActive ? 'bold' : 'normal' 
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

// Enhanced App Component
const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get stored URLs count for badge
  const getStoredUrlsCount = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
      return stored.length;
    } catch {
      return 0;
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    {
      to: '/',
      icon: <HomeIcon />,
      label: 'Home',
      badge: null
    },
    {
      to: '/stats',
      icon: <AnalyticsIcon />,
      label: 'Analytics',
      badge: getStoredUrlsCount() > 0 ? getStoredUrlsCount() : null
    }
  ];

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ py: 1 }}>
              {/* Logo/Brand Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
                  <LinkIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div" fontWeight="bold">
                    URL Shortener
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Fast & Reliable Link Management
                  </Typography>
                </Box>
              </Box>

              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Desktop Navigation */}
              {!isMobile && (
                <Stack direction="row" spacing={1}>
                  {navItems.map((item) => (
                    <NavItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      badge={item.badge}
                    />
                  ))}
                </Stack>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    ml: 2,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Toolbar>
          </Container>
        </AppBar>

        {/* Mobile Navigation Drawer */}
        <MobileDrawer 
          open={mobileOpen} 
          onClose={handleDrawerToggle}
          navItems={navItems}
        />

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            bgcolor: 'grey.50',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </Box>

        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            py: 2, 
            textAlign: 'center' 
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2025 URL Shortener. Built with Material-UI for AffordMed.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Router>
  );
};

export default App;