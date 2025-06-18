import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';

const HeroContainer = styled(Box)(({ theme }) => ({
  background: '#0b0b0b',
  color: '#f5f5f5',
  minHeight: '100vh',
  padding: theme.spacing(8, 4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontFamily: '"Playfair Display", serif',
  fontWeight: 700,
  fontSize: '3.2rem',
  lineHeight: 1.2,
  color: '#f5f5f5',
}));

const SubText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", sans-serif',
  color: '#bbb',
  fontSize: '1.2rem',
  marginTop: theme.spacing(2),
  maxWidth: 500,
}));

const CTAButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  borderRadius: '50px',
  backgroundColor: '#d4af37', // Champagne gold
  color: '#000',
  fontWeight: 600,
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: '#e5c67a',
  },
}));

const BottomBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  background: 'rgba(11,11,11,0.95)',
  padding: theme.spacing(2, 0),
  zIndex: 2000,
}));

const avatarImages = [
  '/assets/avatarF.jpg',
  '/assets/avatarM.jpg',
];

function getRandomAvatar() {
  return avatarImages[Math.floor(Math.random() * avatarImages.length)];
}

export default function AltHome({ onBack }) {
  const avatarSrc = React.useMemo(getRandomAvatar, []);
  return (
    <>
      <HeroContainer>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Title variant="h1">
              Style, Curated.
            </Title>
            <SubText variant="body1">
                AI-powered fashion advisor for next-level drip. Smart recs, bold looks, new-money vibes.
            </SubText>
            <CTAButton variant="contained">
              Get Styled Now
            </CTAButton>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src={avatarSrc}
              alt="Stylish model avatar"
              sx={{
                width: '100%',
                maxWidth: 400,
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)',
                objectFit: 'cover',
              }}
            />
          </Grid>
        </Grid>
      </HeroContainer>
      {onBack && (
        <BottomBar>
          <Button onClick={onBack} variant="outlined" color="secondary">
            Back to Main Home
          </Button>
        </BottomBar>
      )}
    </>
  );
} 