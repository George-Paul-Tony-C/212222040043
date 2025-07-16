import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Grid, Paper, IconButton, Divider,
  Card, CardContent, CardActions, Fade, Slide, Alert, Chip, Stack,
  Container, Avatar, Tooltip, LinearProgress, Snackbar, Badge
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import TimerIcon from '@mui/icons-material/Timer';
import CodeIcon from '@mui/icons-material/Code';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../utils/api';
import logger from '../middleware/logger';

const URLForm = () => {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState(() => {
    return JSON.parse(localStorage.getItem('shortenedUrls')) || [];
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(results));
  }, [results]);

  const handleChange = (index, e) => {
    const updated = [...urls];
    updated[index][e.target.name] = e.target.value;
    setUrls(updated);
  };

  const addUrl = () => {
    if (urls.length < 5) setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
  };

  const deleteUrl = (index) => {
    const updated = urls.filter((_, i) => i !== index);
    setUrls(updated);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'Link copied to clipboard!', severity: 'success' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const responseData = [];

      for (let i = 0; i < urls.length; i++) {
        const res = await api.post('/shorturls', urls[i]);
        responseData.push(res.data);
        await logger('frontend', 'info', 'api', `Short URL created: ${res.data.shortLink}`);
      }

      const newResults = [...results, ...responseData];
      setResults(newResults);
      setUrls([{ url: '', validity: '', shortcode: '' }]);
      setSnackbar({ open: true, message: 'URLs shortened successfully!', severity: 'success' });
    } catch (err) {
      await logger('frontend', 'error', 'api', err.message);
      setSnackbar({ open: true, message: 'Error creating short URLs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (shortLink) => {
    window.open(shortLink, '_blank');
  };

  const clearResults = () => {
    setResults([]);
    localStorage.removeItem('shortenedUrls');
    setSnackbar({ open: true, message: 'All results cleared!', severity: 'info' });
  };

  const isFormValid = urls.some(entry => entry.url.trim() !== '');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Avatar sx={{ 
          mx: 'auto', 
          mb: 2, 
          bgcolor: 'primary.main', 
          width: 64, 
          height: 64 
        }}>
          <LinkIcon fontSize="large" />
        </Avatar>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          URL Shortener
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Shorten up to 5 URLs with custom validity and shortcodes
        </Typography>
      </Box>

      <Card elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
              Enter URLs ({urls.length}/5)
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(urls.length / 5) * 100} 
              sx={{ mb: 2, height: 6, borderRadius: 3 }}
            />
          </Box>

          <Stack spacing={3}>
            {urls.map((entry, idx) => (
              <Fade in={true} timeout={300} key={idx}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <TextField 
                        fullWidth 
                        label="Long URL" 
                        name="url" 
                        value={entry.url} 
                        onChange={(e) => handleChange(idx, e)}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: <LinkIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField 
                        fullWidth 
                        label="Validity (mins)" 
                        name="validity" 
                        value={entry.validity} 
                        onChange={(e) => handleChange(idx, e)}
                        variant="outlined"
                        size="small"
                        type="number"
                        InputProps={{
                          startAdornment: <TimerIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField 
                        fullWidth 
                        label="Shortcode (optional)" 
                        name="shortcode" 
                        value={entry.shortcode} 
                        onChange={(e) => handleChange(idx, e)}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: <CodeIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Tooltip title="Remove URL">
                        <IconButton 
                          onClick={() => deleteUrl(idx)}
                          color="error"
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'error.light',
                              color: 'white'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Card>
              </Fade>
            ))}
          </Stack>
        </CardContent>

        <CardActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button 
              onClick={addUrl} 
              variant="outlined" 
              startIcon={<AddIcon />}
              disabled={urls.length >= 5}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'medium'
              }}
            >
              Add URL
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={!isFormValid || loading}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'medium',
                px: 4
              }}
            >
              {loading ? 'Shortening...' : 'Shorten URLs'}
            </Button>
          </Stack>
        </CardActions>
      </Card>

      {results.length > 0 && (
        <Slide in={true} direction="up" timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                  Results
                  <Badge badgeContent={results.length} color="primary" sx={{ ml: 1 }} />
                </Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={clearResults}
                  startIcon={<ClearAllIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Clear All
                </Button>
              </Box>

              <Stack spacing={2}>
                {results.map((r, i) => (
                  <Fade in={true} timeout={300} key={i}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'success.light',
                        borderColor: 'success.main',
                        '&:hover': {
                          boxShadow: 3
                        }
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={8}>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Short Link:</strong>
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: 'monospace',
                                bgcolor: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                flex: 1
                              }}
                            >
                              {r.shortLink}
                            </Typography>
                            <Tooltip title="Copy to clipboard">
                              <IconButton 
                                size="small" 
                                onClick={() => copyToClipboard(r.shortLink)}
                                sx={{ color: 'success.dark' }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Open in new tab">
                              <IconButton 
                                size="small" 
                                onClick={() => handleRedirect(r.shortLink)}
                                sx={{ color: 'success.dark' }}
                              >
                                <OpenInNewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Expires:</strong>
                          </Typography>
                          <Chip 
                            label={new Date(r.expiry).toLocaleString()}
                            size="small"
                            icon={<TimerIcon />}
                            sx={{ 
                              bgcolor: 'warning.light',
                              color: 'warning.dark'
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Fade>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Slide>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default URLForm;