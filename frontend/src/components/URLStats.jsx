import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider, 
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Grid,
  Alert,
  IconButton,
  Tooltip,
  Stack,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Link as LinkIcon,
  Analytics,
  Schedule,
  Mouse,
  Error,
  Public,
  LocationOn,
  AccessTime,
  Launch,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';
import logger from '../middleware/logger';

const URLStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storedUrls] = useState(() => {
    return JSON.parse(localStorage.getItem('shortenedUrls')) || [];
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const results = [];

      for (const entry of storedUrls) {
        const parts = entry.shortLink.split('/');
        const shortcode = parts[parts.length - 1];

        try {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shorturls/${shortcode}`);
          results.push({ ...res.data, shortLink: entry.shortLink });

          try {
            await logger('frontend', 'info', 'api', `Fetched stats for: ${shortcode}`);
          } catch (logErr) {
            console.warn('Logging failed:', logErr.message);
          }
        } catch (err) {
          results.push({ shortLink: entry.shortLink, error: 'Failed to fetch stats' });

          try {
            await logger('frontend', 'error', 'api', `Error fetching stats for ${shortcode}: ${err.message}`);
          } catch (logErr) {
            console.warn('Logging failed:', logErr.message);
          }
        }
      }

      setStats(results);
      setLoading(false);
    };

    fetchStats();
  }, []);

  const refreshStats = () => {
    window.location.reload();
  };

  const getClicksColor = (clicks) => {
    if (clicks === 0) return 'default';
    if (clicks < 10) return 'primary';
    if (clicks < 50) return 'secondary';
    return 'success';
  };

  const formatUrl = (url) => {
    if (url.length > 50) {
      return url.substring(0, 50) + '...';
    }
    return url;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <Analytics fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
                URL Analytics
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Track and analyze your shortened URLs performance
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Refresh Statistics">
            <IconButton 
              onClick={refreshStats}
              size="large"
              sx={{ bgcolor: 'action.hover' }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ bgcolor: 'primary.50' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {stats.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total URLs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ bgcolor: 'success.50' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {stats.reduce((acc, stat) => acc + (stat.totalClicks || 0), 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Clicks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ bgcolor: 'warning.50' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {stats.filter(stat => stat.error).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Errors
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ mb: 4 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Loading statistics...
            </Typography>
          </Box>
        </Box>
      )}

      {/* No Data State */}
      {!loading && stats.length === 0 && (
        <Alert 
          severity="info" 
          icon={<LinkIcon />}
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-message': { fontSize: '1.1rem' }
          }}
        >
          <Typography variant="h6" gutterBottom>
            No URL statistics available
          </Typography>
          <Typography>
            Create some shortened URLs first to view their analytics and performance metrics.
          </Typography>
        </Alert>
      )}

      {/* Stats Cards */}
      {!loading && stats.length > 0 && (
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} key={index}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 3,
                  overflow: 'visible',
                  position: 'relative',
                  '&:hover': { 
                    elevation: 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ 
                      bgcolor: stat.error ? 'error.main' : 'primary.main',
                      width: 48,
                      height: 48
                    }}>
                      {stat.error ? <Error /> : <LinkIcon />}
                    </Avatar>
                  }
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Short Link
                      </Typography>
                      <IconButton size="small" onClick={() => window.open(stat.shortLink, '_blank')}>
                        <Launch fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  subheader={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace',
                        bgcolor: 'action.hover',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'inline-block',
                        mt: 1
                      }}
                    >
                      {stat.shortLink}
                    </Typography>
                  }
                  action={
                    !stat.error && (
                      <Badge 
                        badgeContent={stat.totalClicks || 0} 
                        color={getClicksColor(stat.totalClicks || 0)}
                        max={999}
                      >
                        <Chip 
                          icon={<Mouse />}
                          label="Clicks"
                          color={getClicksColor(stat.totalClicks || 0)}
                          variant="outlined"
                        />
                      </Badge>
                    )
                  }
                />

                <CardContent sx={{ pt: 0 }}>
                  {stat.error ? (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      <Typography variant="body1">{stat.error}</Typography>
                    </Alert>
                  ) : (
                    <Stack spacing={2}>
                      {/* Original URL */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Public color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Original URL:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            bgcolor: 'grey.100',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            wordBreak: 'break-all'
                          }}
                        >
                          {formatUrl(stat.originalUrl)}
                        </Typography>
                      </Box>

                      {/* Timestamps */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Created:
                            </Typography>
                            <Typography variant="body2">
                              {new Date(stat.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Expires:
                            </Typography>
                            <Typography variant="body2">
                              {new Date(stat.expiresAt).toLocaleString()}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Clicks Details */}
                      {stat.clicks && stat.clicks.length > 0 && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Mouse color="primary" />
                            Click Details ({stat.clicks.length})
                          </Typography>
                          
                          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                            {stat.clicks.map((click, i) => (
                              <Paper 
                                key={i} 
                                elevation={1} 
                                sx={{ 
                                  p: 2, 
                                  mb: 1,
                                  bgcolor: 'grey.50',
                                  borderRadius: 2
                                }}
                              >
                                <Grid container spacing={1} alignItems="center">
                                  <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <AccessTime fontSize="small" color="action" />
                                      <Typography variant="body2">
                                        {new Date(click.timestamp).toLocaleString()}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Public fontSize="small" color="action" />
                                      <Typography variant="body2">
                                        {click.source || 'Unknown'}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <LocationOn fontSize="small" color="action" />
                                      <Typography variant="body2">
                                        {click.location || 'Unknown'}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Paper>
                            ))}
                          </Box>
                        </>
                      )}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default URLStats;