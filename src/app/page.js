"use client"

import { useState } from "react";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components
const HeroSection = styled(Paper)(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  padding: theme.spacing(8, 0, 6),
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6),
    paddingRight: 0,
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  fontSize: "1.2rem",
}));

const gradientTextStyle = {
  background: 'linear-gradient(0deg, #fff, #de0073)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
};

// Fashion quotes for inspiration
const fashionQuotes = [
  "Style is a way to say who you are without having to speak.",
  "You can have anything you want in life if you dress for it. —Edith Head",
  "Clothes mean nothing until someone lives in them.",
  "Style is not about having a lot of clothes, it's about having the right ones.",
  "Fashion is what you're offered four times a year by designers. Style is what you choose.",
];

export default function Home() {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const theme = useTheme();

  // Get a random quote
  const randomQuote = fashionQuotes[Math.floor(Math.random() * fashionQuotes.length)];

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuggestions(null);
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setPreview(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!preview) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(preview);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        const apiResponse = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64data,
          }),
        });

        if (!apiResponse.ok) {
          throw new Error('Failed to analyze image');
        }

        const data = await apiResponse.json();
        setSuggestions(data);
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* App Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            stailist
          </Typography>
          <Button color="inherit" href="/">
            StyleMe
          </Button>
          <Button color="inherit" sx={{ ml: 2 }}>
            Log In
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <HeroContent>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={gradientTextStyle}
            >
              Discover Your Style
            </Typography>
            <Typography variant="h5" paragraph sx={gradientTextStyle}>
              {randomQuote}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <UploadButton
                  variant="contained"
                  color="primary"
                  component="span"
                  disabled={isLoading}
                >
                  {isLoading ? 'Analyzing...' : 'Upload & Style Me'}
                </UploadButton>
              </label>
            </Box>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Preview and Results Section */}
      <Container maxWidth="md">
        {preview && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={300}
              style={{
                borderRadius: theme.shape.borderRadius,
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        {error && (
          <Paper
            sx={{
              p: 2,
              mb: 2,
              bgcolor: 'error.light',
              color: 'error.contrastText',
            }}
          >
            {error}
          </Paper>
        )}

        {suggestions && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Your Style Recommendations
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Image Analysis
            </Typography>
            <Typography paragraph>
              {suggestions.imageDescription}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Recommendations
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {suggestions.recommendations.recommendations.map((rec, index) => (
                <Typography component="li" key={index} paragraph>
                  {rec}
                </Typography>
              ))}
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Why These Work
            </Typography>
            <Typography paragraph>
              {suggestions.recommendations.explanation}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Confidence Score
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${suggestions.recommendations.confidence * 100}%`,
                    height: '100%',
                    bgcolor: 'primary.main',
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {Math.round(suggestions.recommendations.confidence * 100)}% confidence
              </Typography>
            </Box>
          </Paper>
        )}
      </Container>
    </>
  );
}
