"use client";
import { Box, Button, Stack, TextField, MenuItem, Select, InputLabel, FormControl, Typography, IconButton } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import StarsCanvas from "../components/starbg";
import styles from "../styles/Home.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "./navbar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");
  const [searchOptions, setSearchOptions] = useState({
    teachingStyle: "",
    difficultyLevel: "",
    rating: "",
    subject: "",
    availability: "",
  });
  const [ratingOptions, setRatingOptions] = useState({
    professorName: "",
    subject: "",
    teachingStyle: "",
    difficultyLevel: "",
    availability: "",
    rating: "",
    review: "",
  });

  // Auto scroll to bottom when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() && !Object.values(searchOptions).some(v => v)) return;

    const searchQuery = Object.entries(searchOptions)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    
    const finalMessage = searchQuery
      ? `Search for professor with ${searchQuery}`
      : message;
    
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: finalMessage },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: finalMessage }],
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      const processText = async ({ done, value }) => {
        if (done) return result;
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      };

      await reader.read().then(processText);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((messages) => [
        ...messages.slice(0, -1),
        { role: "assistant", content: "Sorry, there was an error processing your request." },
      ]);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (event) => {
    const { name, value } = event.target;
    setRatingOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitRating = () => {
    const { professorName } = ratingOptions;
    
    if (!professorName.trim()) {
      alert("Please enter professor name");
      return;
    }
  
    setMessages((messages) => [
      ...messages,
      { role: "user", content: `Rating submitted for Professor: ${professorName}` },
      { role: "assistant", content: "Professor rating successfully submitted!" },
    ]);

    setRatingOptions({
      professorName: "",
      subject: "",
      teachingStyle: "",
      difficultyLevel: "",
      availability: "",
      rating: "",
      review: "",
    });
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
      },
    ]);
  };

  return (
    <Box 
      sx={{
        minHeight: "100vh",
        bgcolor: "#000",
        position: "relative",
      }}
    >
      {/* Stars Background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <StarsCanvas />
      </Box>

      {/* Fixed Navbar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Navbar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          pt: "120px", // Space for navbar
          pb: 3,
          minHeight: "100vh",
        }}
      >
        {!user ? (
          <Box
            sx={{
              textAlign: "center",
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 120px)",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              className={styles.glowingText}
              sx={{ color: "#fff" }}
            >
              Welcome to Rate My Professor AI Assistant
            </Typography>
            <Typography
              variant="body1"
              mt={2}
              className={styles.glowingParagraph}
              sx={{ color: "#ccc" }}
            >
              Discover insights on professors, from teaching styles to course
              difficulty, all in one place.
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 4,
                backgroundColor: "#5c2872",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#512da8",
                },
              }}
              onClick={() => router.push("/sign-in")}
            >
              Get Started
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              px: 2,
              maxWidth: "1600px",
              margin: "0 auto",
            }}
          >
            <Stack 
              direction="row" 
              spacing={2}
              sx={{
                height: "calc(100vh - 140px)", // Full viewport minus navbar and padding
              }}
            >
              {/* Search Box - Scrollable */}
              <Box
                sx={{
                  width: "280px",
                  minWidth: "280px",
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  p: 2.5,
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "4px",
                    "&:hover": {
                      background: "#555",
                    },
                  },
                }}
              >
                <Typography variant="h6" mb={2} fontWeight="600">
                  Search for Professor
                </Typography>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Teaching Style</InputLabel>
                  <Select
                    name="teachingStyle"
                    value={searchOptions.teachingStyle}
                    onChange={handleSearchChange}
                    label="Teaching Style"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Hands-on">Hands-on</MenuItem>
                    <MenuItem value="Lecture-based">Lecture-based</MenuItem>
                    <MenuItem value="Project-based">Project-based</MenuItem>
                    <MenuItem value="Discussion-oriented">Discussion-oriented</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    name="difficultyLevel"
                    value={searchOptions.difficultyLevel}
                    onChange={handleSearchChange}
                    label="Difficulty Level"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="Difficult">Difficult</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Rating</InputLabel>
                  <Select
                    name="rating"
                    value={searchOptions.rating}
                    onChange={handleSearchChange}
                    label="Rating"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="1">1 Star</MenuItem>
                    <MenuItem value="2">2 Stars</MenuItem>
                    <MenuItem value="3">3 Stars</MenuItem>
                    <MenuItem value="4">4 Stars</MenuItem>
                    <MenuItem value="5">5 Stars</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Subject"
                  name="subject"
                  value={searchOptions.subject}
                  onChange={handleSearchChange}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    name="availability"
                    value={searchOptions.availability}
                    onChange={handleSearchChange}
                    label="Availability"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Somewhat Available">Somewhat Available</MenuItem>
                    <MenuItem value="Limited">Limited</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#3700b3",
                    color: "#ffffff",
                    py: 1.2,
                    fontWeight: "600",
                    "&:hover": {
                      backgroundColor: "#2D84BD",
                    },
                  }}
                  onClick={sendMessage}
                >
                  SEARCH
                </Button>
              </Box>

              {/* Chat Box - Fixed height with scroll */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Messages Area - Scrollable */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#888",
                      borderRadius: "4px",
                      "&:hover": {
                        background: "#555",
                      },
                    },
                  }}
                >
                  {messages.map((msg, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "75%",
                          backgroundColor: msg.role === "user" ? "#512da8" : "#f1f1f1",
                          color: msg.role === "user" ? "#fff" : "#333",
                          borderRadius: msg.role === "user" 
                            ? "16px 16px 4px 16px" 
                            : "16px 16px 16px 4px",
                          padding: "12px 16px",
                          wordWrap: "break-word",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography variant="body1">
                          {msg.content}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Input Area - Fixed at bottom */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={sendMessage}
                      sx={{
                        backgroundColor: "#5c2872",
                        minWidth: "80px",
                        borderRadius: "20px",
                        "&:hover": {
                          backgroundColor: "#3700b3",
                        },
                      }}
                    >
                      Send
                    </Button>
                    <IconButton
                      onClick={clearChat}
                      color="error"
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(244, 67, 54, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>

              {/* Rating Box - Scrollable */}
              <Box
                sx={{
                  width: "280px",
                  minWidth: "280px",
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  p: 2.5,
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "4px",
                    "&:hover": {
                      background: "#555",
                    },
                  },
                }}
              >
                <Typography variant="h6" mb={2} fontWeight="600">
                  Rate a Professor
                </Typography>

                <TextField
                  label="Professor Name"
                  name="professorName"
                  value={ratingOptions.professorName}
                  onChange={handleRatingChange}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Subject"
                  name="subject"
                  value={ratingOptions.subject}
                  onChange={handleRatingChange}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Teaching Style</InputLabel>
                  <Select
                    name="teachingStyle"
                    value={ratingOptions.teachingStyle}
                    onChange={handleRatingChange}
                    label="Teaching Style"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Hands-on">Hands-on</MenuItem>
                    <MenuItem value="Lecture-based">Lecture-based</MenuItem>
                    <MenuItem value="Project-based">Project-based</MenuItem>
                    <MenuItem value="Discussion-oriented">Discussion-oriented</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    name="difficultyLevel"
                    value={ratingOptions.difficultyLevel}
                    onChange={handleRatingChange}
                    label="Difficulty Level"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="Difficult">Difficult</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    name="availability"
                    value={ratingOptions.availability}
                    onChange={handleRatingChange}
                    label="Availability"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Somewhat Available">Somewhat Available</MenuItem>
                    <MenuItem value="Limited">Limited</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Rating (1-5)"
                  name="rating"
                  type="number"
                  value={ratingOptions.rating}
                  onChange={handleRatingChange}
                  fullWidth
                  size="small"
                  inputProps={{ min: 1, max: 5 }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Review"
                  name="review"
                  value={ratingOptions.review}
                  onChange={handleRatingChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={submitRating}
                  sx={{
                    backgroundColor: "#3700b3",
                    color: "#ffffff",
                    py: 1.2,
                    fontWeight: "600",
                    "&:hover": {
                      backgroundColor: "#2D84BD",
                    },
                  }}
                >
                  SUBMIT RATING
                </Button>
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}