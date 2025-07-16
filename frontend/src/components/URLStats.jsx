import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Divider, CircularProgress } from '@mui/material';
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
  }, []); // ✅ Run only once on mount

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>URL Statistics</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : stats.length === 0 ? (
        <Typography>No URL stats available. Please create some shortened URLs first.</Typography>
      ) : (
        stats.map((stat, index) => (
          <Paper key={index} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">Short Link: {stat.shortLink}</Typography>

            {stat.error ? (
              <Typography color="error">{stat.error}</Typography>
            ) : (
              <>
                <Typography><strong>Original URL:</strong> {stat.originalUrl}</Typography>
                <Typography><strong>Created At:</strong> {new Date(stat.createdAt).toLocaleString()}</Typography>
                <Typography><strong>Expires At:</strong> {new Date(stat.expiresAt).toLocaleString()}</Typography>
                <Typography><strong>Total Clicks:</strong> {stat.totalClicks}</Typography>

                {stat.clicks && stat.clicks.length > 0 && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle1">Clicks:</Typography>
                    {stat.clicks.map((click, i) => (
                      <Box key={i} sx={{ ml: 2, mb: 1 }}>
                        <Typography variant="body2">
                          🕒 {new Date(click.timestamp).toLocaleString()} | 🌐 Source: {click.source || 'Unknown'} | 📍 Location: {click.location || 'Unknown'}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
              </>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
};

export default URLStats;
