import { Send } from "@mui/icons-material";
import { Box, Button, FormControl, Input, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import supabase from "@/database/supabase";

export default function CardCreate({ data, handle }) {
  const [text, setText] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(true);

  useEffect(() => {
    const lastSubmitTime = localStorage.getItem(`lastSubmitTime_${data.email}`);
    if (lastSubmitTime) {
      const timePassed = Date.now() - parseInt(lastSubmitTime, 10);
      if (timePassed < 600000) {
        setCanSubmit(false);
        setTimeout(() => setCanSubmit(true), 600000 - timePassed);
      }
    }
  }, [data.email]);

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 50 && inputValue.split(" ").length <= 20) {
      setText({ ...text, title: inputValue });
    }
  };

  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 200) {
      setText({ ...text, description: inputValue });
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      setError("Please wait before submitting again.");
      return;
    }

    if (!text.title || !text.description) {
      setError("Please fill in both title and description.");
      return;
    }

    setError("");

    const { data: userData, error: userError } = await supabase
      .from("login")
      .select()
      .eq("email", data.email);

    if (userError) {
      console.error("Error fetching user data:", userError.message);
      return;
    }

    if (userData) {
      const { data: newCard, error: cardError } = await supabase
        .from("text")
        .insert({
          title: text.title,
          email: data.email,
          description: text.description,
        })
        .select()
        .single();

      if (cardError) {
        console.error("Error creating card:", cardError.message);
        return;
      }

      // Call the handle function with the new card
      handle(newCard);

      localStorage.setItem(
        `lastSubmitTime_${data.email}`,
        Date.now().toString()
      );
      setCanSubmit(false);
      setTimeout(() => setCanSubmit(true), 600000); // 10 minutes

      // Reset the form
      setText({ title: "", description: "" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "10rem",
        width: { xs: "90%", md: "60%" },
        marginTop: "2rem",
        bgcolor: "#181818",
        boxShadow: 5,
        borderRadius: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
          padding: 2,
        }}
      >
        <FormControl sx={{ width: "100%" }}>
          <Input
            placeholder="Title"
            type="text"
            value={text.title}
            sx={{ color: "white" }}
            onChange={handleTitleChange}
          />
        </FormControl>
        <FormControl sx={{ width: "100%" }}>
          <Input
            placeholder="Description"
            type="text"
            sx={{ color: "white" }}
            value={text.description}
            onChange={handleDescriptionChange}
          />
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={handleClick}
            disabled={!canSubmit}
          >
            {canSubmit ? "Send" : "Wait..."}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
