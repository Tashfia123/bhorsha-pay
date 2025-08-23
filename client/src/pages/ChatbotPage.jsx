import React from "react";
import { Dialog, DialogContent, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const ChatbotPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "20px",
          background: "#1E1E2F",
          color: "white",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          background: "#2A2A3C",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          🤖 BlockFunder Chatbot
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ padding: 0, height: "75vh" }}>
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/hpXRnHUypnv4SHnBylh1I"
          width="100%"
          style={{
            height: "100%",
            border: "none",
            background: "#1E1E2F",
          }}
          title="AI ASSISTANCE"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotPage;
