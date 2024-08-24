"use client";
import { Box, Button, Stack, TextField, MenuItem, Select, InputLabel, FormControl, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import StarsCanvas from "../components/starbg";
import styles from "../styles/Home.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "./navbar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
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

  const sendMessage = async () => {
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
    setMessages((prevMessages) =>
      prevMessages.filter((_, index) => index === 0)
    );
  };

  return (
    <Box className={styles.main}>
      <Navbar />

      {/* Container for the main content */}
      <Box
        className={styles.contentContainer}
        sx={{ paddingTop: "288px", overflowY: "auto", minHeight: "100vh" }}
      >
        <StarsCanvas className={styles.starsCanvas} />

        {!user ? (
          <Box
          textAlign="center"
          mt={4}
          px={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="calc(100vh - 288px)" 
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            className={styles.glowingText}
          >
            Welcome to Rate My Professor AI Assistant
          </Typography>
          <Typography
            variant="body1"
            mt={2}
            className={styles.glowingParagraph}
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
          <Stack direction="row" spacing={2} p={2} className={styles.container}>
            {/* Search Box */}
            <Box
              width="300px"
              p={2}
              border="1px solid #ddd"
              borderRadius="8px"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              bgcolor="#fff"
              className={styles.searchBox}
            >
              <Typography variant="h6" mb={2}>
                Search for Professor
              </Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel id="teaching-style-label">
                  Teaching Style
                </InputLabel>
                <Select
                  labelId="teaching-style-label"
                  name="teachingStyle"
                  value={searchOptions.teachingStyle}
                  onChange={handleSearchChange}
                  displayEmpty
                >
                  <MenuItem value="Hands-on">Hands-on</MenuItem>
                  <MenuItem value="Lecture-based">Lecture-based</MenuItem>
                  <MenuItem value="Project-based">Project-based</MenuItem>
                  <MenuItem value="Discussion-oriented">
                    Discussion-oriented
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="difficulty-level-label">
                  Difficulty Level
                </InputLabel>
                <Select
                  labelId="difficulty-level-label"
                  name="difficultyLevel"
                  value={searchOptions.difficultyLevel}
                  onChange={handleSearchChange}
                  displayEmpty
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Difficult">Difficult</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="rating-label">Rating</InputLabel>
                <Select
                  labelId="rating-label"
                  name="rating"
                  value={searchOptions.rating}
                  onChange={handleSearchChange}
                  displayEmpty
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Subject"
                name="subject"
                value={searchOptions.subject}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="availability-label">Availability</InputLabel>
                <Select
                  labelId="availability-label"
                  name="availability"
                  value={searchOptions.availability}
                  onChange={handleSearchChange}
                  displayEmpty
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Somewhat Available">
                    Somewhat Available
                  </MenuItem>
                  <MenuItem value="Limited">Limited</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#3700b3",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#2D84BD",
                  },
                }}
                onClick={sendMessage}
              >
                Search
              </Button>
            </Box>

            {/* Chat Box */}
            <Box
              width="calc(100% - 320px)"
              height="700px"
              p={2}
              border="1px solid #ddd"
              borderRadius="8px"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              bgcolor="#fff"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              className={styles.chatBox}
            >
              <Box
                flexGrow={1}
                overflow="auto"
                mb={2}
                className={styles.messageContainer}
              >
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    display="flex"
                    flexDirection={msg.role === "user" ? "row-reverse" : "row"}
                    mb={1}
                  >
                    <Typography
                      variant="body1"
                      className={styles.messageBubble}
                      sx={{
                        backgroundColor:
                          msg.role === "user" ? "#512da8" : "#f1f1f1",
                        color: msg.role === "user" ? "#fff" : "#333",
                        borderRadius:
                          msg.role === "user"
                            ? "10px 0px 10px 10px"
                            : "0px 10px 10px 10px",
                        padding: "10px",
                        maxWidth: "70%",
                      }}
                    >
                      {msg.content}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box display="flex" alignItems="center">
                <TextField
                  variant="outlined"
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  InputProps={{
                    sx: {
                      bgcolor: "#fff",
                      color: "#333",
                      borderRadius: "4px",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    ml: 2,
                    backgroundColor: "#5c2872",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#3700b3",
                    },
                  }}
                  onClick={sendMessage}
                >
                  Send
                </Button>
                <IconButton
                  aria-label="clear"
                  color="error"
                  onClick={clearChat}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Rating Box */}
            <Box
              width="300px"
              p={2}
              border="1px solid #ddd"
              borderRadius="8px"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              bgcolor="#fff"
              className={styles.ratingBox}
            >
              <Typography variant="h6" mb={2}>
                Rate a Professor
              </Typography>

              <TextField
                label="Professor Name"
                name="professorName"
                value={ratingOptions.professorName}
                onChange={handleRatingChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Subject"
                name="subject"
                value={ratingOptions.subject}
                onChange={handleRatingChange}
                fullWidth
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="teaching-style-label">Teaching Style</InputLabel>
                <Select
                  labelId="teaching-style-label"
                  name="teachingStyle"
                  value={ratingOptions.teachingStyle}
                  onChange={handleRatingChange}
                  displayEmpty
                >
                  <MenuItem value="Hands-on">Hands-on</MenuItem>
                  <MenuItem value="Lecture-based">Lecture-based</MenuItem>
                  <MenuItem value="Project-based">Project-based</MenuItem>
                  <MenuItem value="Discussion-oriented">
                    Discussion-oriented
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="difficulty-level-label">
                  Difficulty Level
                </InputLabel>
                <Select
                  labelId="difficulty-level-label"
                  name="difficultyLevel"
                  value={ratingOptions.difficultyLevel}
                  onChange={handleRatingChange}
                  displayEmpty
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Difficult">Difficult</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="availability-label">Availability</InputLabel>
                <Select
                  labelId="availability-label"
                  name="availability"
                  value={ratingOptions.availability}
                  onChange={handleRatingChange}
                  displayEmpty
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Somewhat Available">
                    Somewhat Available
                  </MenuItem>
                  <MenuItem value="Limited">Limited</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Rating"
                name="rating"
                type="number"
                value={ratingOptions.rating}
                onChange={handleRatingChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Review"
                name="review"
                value={ratingOptions.review}
                onChange={handleRatingChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#3700b3",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#2D84BD",
                  },
                  mt: 2,
                }}
                onClick={submitRating}
              >
                Submit Rating
              </Button>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
}