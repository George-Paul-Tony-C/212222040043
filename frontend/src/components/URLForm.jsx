import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Grid, Paper, IconButton, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import api from '../utils/api';
import logger from '../middleware/logger';

const URLForm = () => {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState(() => {
    return JSON.parse(localStorage.getItem('shortenedUrls')) || [];
  });

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

  const handleSubmit = async () => {
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
    } catch (err) {
      await logger('frontend', 'error', 'api', err.message);
      alert('Error creating short URLs');
    }
  };

  const handleRedirect = (shortLink) => {
    window.open(shortLink, '_blank');
  };

  const clearResults = () => {
    setResults([]);
    localStorage.removeItem('shortenedUrls');
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Shorten up to 5 URLs</Typography>
      {urls.map((entry, idx) => (
        <Paper key={idx} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField fullWidth label="Long URL" name="url" value={entry.url} onChange={(e) => handleChange(idx, e)} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Validity (mins)" name="validity" value={entry.validity} onChange={(e) => handleChange(idx, e)} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Shortcode (optional)" name="shortcode" value={entry.shortcode} onChange={(e) => handleChange(idx, e)} />
            </Grid>
            <Grid item xs={12} sm={1}>
              <IconButton onClick={() => deleteUrl(idx)}><DeleteIcon /></IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Box mb={2}>
        <Button onClick={addUrl} variant="outlined" sx={{ mr: 2 }}>Add URL</Button>
        <Button onClick={handleSubmit} variant="contained">Shorten</Button>
      </Box>

      {results.length > 0 && (
        <Box mt={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Results:</Typography>
            <Button variant="outlined" color="error" onClick={clearResults}>Clear All</Button>
          </Box>
          {results.map((r, i) => (
            <Paper key={i} sx={{ p: 2, mt: 2 }}>
              <Typography><strong>Short Link:</strong> {r.shortLink} {' '}
                <IconButton size="small" onClick={() => handleRedirect(r.shortLink)}>
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Typography>
              <Typography><strong>Expiry:</strong> {new Date(r.expiry).toLocaleString()}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default URLForm;
