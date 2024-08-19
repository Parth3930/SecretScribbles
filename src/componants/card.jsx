import { Box, Button, Typography } from "@mui/material";
import React from "react";
import fira from "./fonts/fira";
import ubunto from "./fonts/ubuntu";

export default function Card(props) {
  return (
    <Box
      sx={{
        bgcolor: "#252525",
        padding: 2,
        borderRadius: 2,
        boxShadow: 5,
        display: "flex",
        flexDirection: "column",
        minWidth: 300,
        maxWidth: "100%",
        marginBottom: 2,
        height: "auto",
      }}
    >
      <Typography
        className={fira.className}
        sx={{ textAlign: "start", wordWrap: "break-word", color: "white" }}
      >
        {props.data.title}
      </Typography>
      <Typography
        className={ubunto.className}
        sx={{ textAlign: "start", wordWrap: "break-word", color: "white" }}
      >
        {props.data.description}
      </Typography>
      {props.user && props.data.email === props.user.email && (
        <Button
          size="small"
          sx={{
            marginLeft: "auto",
            marginTop: 2,
          }}
          variant="contained"
          color="error"
          onClick={() => props.handle(props.data.id)}
        >
          Delete
        </Button>
      )}
    </Box>
  );
}
