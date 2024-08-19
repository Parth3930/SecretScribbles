import { Box, Typography } from "@mui/material";
import fira from "./fonts/fira";

export default function NaviBar() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#252525",
        height: "3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" className={fira.className} sx={{color: "white"}}>
        SecretScribbles
      </Typography>
    </Box>
  );
}
