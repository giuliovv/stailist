import React, { useRef } from 'react';
import { Box, Typography, Button, Grid, useTheme } from '@mui/material';
import { styled } from '@mui/system';

const HeroContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
  color: '#f2f2f2',
  minHeight: '100vh',
  padding: theme.spacing(8, 4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const NeonText = styled(Typography)(({ color = '#00ffcc' }) => ({
  fontSize: '3rem',
  fontWeight: 700,
  textShadow: `0 0 6px ${color}, 0 0 20px ${color}`,
}));

const HeroButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  borderRadius: '50px',
  background: '#00ffcc',
  color: '#000',
  textTransform: 'uppercase',
  boxShadow: '0 0 10px #00ffcc, 0 0 20px #00ffcc',
  '&:hover': {
    background: '#0ff',
    boxShadow: '0 0 20px #0ff, 0 0 30px #0ff',
  },
}));

export default function AltHome({ onBack }) {
  const theme = useTheme();
  const fileInputRef = useRef();

  return (
    <HeroContainer>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={7}>
          <NeonText variant="h1" color="#00ffcc">
            Style, Curated.
          </NeonText>
          <Typography variant="h5" sx={{ mt: 2, color: '#ccc' }}>
            Your AI fashion advisor for next-level drip. Smart recs, bold looks, new-money vibes.
          </Typography>
          <HeroButton
            variant="contained"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Get Styled
          </HeroButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            // You can add onChange here to handle uploads
          />
          {onBack && (
            <Button sx={{ mt: 2, ml: 2 }} onClick={onBack} variant="outlined" color="secondary">
              Back to Main Home
            </Button>
          )}
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src="/assets/fashion-avatar.png"
            alt="Fashion avatar"
            sx={{
              width: '100%',
              maxWidth: 400,
              borderRadius: '16px',
              boxShadow: '0 0 20px rgba(0, 255, 204, 0.4)',
              filter: 'drop-shadow(0 0 8px #0ff)',
            }}
          />
        </Grid>
      </Grid>
    </HeroContainer>
  );
} 