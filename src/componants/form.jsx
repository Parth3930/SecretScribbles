"use client";
import { Box, Button, FormControl, Input } from "@mui/material";
import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import supabase from "@/database/supabase";
import ubunto from "./fonts/ubuntu";
import Cookies from "js-cookie";
import { randomBytes } from "crypto";

export default function Form() {
  const [userdata, setuserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [login, setLogin] = useState(false);
  const [Error, setError] = useState(null);
  const { push } = useRouter();

  useEffect(() => {
    const loggedIn = Cookies.get("login");
    if (loggedIn) {
      push("/home");
    }
  }, []);

  const generateRandomString = (length) => {
    return randomBytes(length).toString("hex");
  };

  const tokenLength = 32;

  const handleClick = async (e) => {
    e.preventDefault();

    if (!userdata.email || !userdata.password) {
      setError("Please fill in all fields before submitting");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("login")
        .select()
        .eq("email", userdata.email);

      if (data && data.length > 0) {
        const storedPassword = data[0].password;

        const passwordMatch = await bcrypt.compare(
          userdata.password,
          storedPassword
        );
        if (passwordMatch) {
          const newToken = generateRandomString(tokenLength);

          const { error: updateError } = await supabase
            .from("login")
            .update({ token: newToken })
            .eq("email", userdata.email);

          if (updateError) {
            console.error("Error updating token:", updateError.message);
            setError("An error occurred. Please try again later.");
            return;
          }

          Cookies.set("login", newToken, { expires: 5 });

          push("/home");
          return;
        } else {
          setError("Incorrect Password");
          return;
        }
      }

      if (error) {
        console.log("Error fetching data from the database:", error.message);
        setError("An error occurred. Please try again later.");
        return;
      }

      const hashedPassword = await bcrypt.hash(userdata.password, 10);
      const token = generateRandomString(tokenLength);

      const { data: insertData, error: insertError } = await supabase
        .from("login")
        .insert({
          email: userdata.email,
          name: userdata.name,
          password: hashedPassword,
          token: token,
        });

      if (insertError) {
        console.log(
          "Error inserting data into the database:",
          insertError.message
        );
        setError("An error occurred. Please try again later.");
        return;
      }

      Cookies.set("login", token, { expires: 5 });

      push("/home");
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleToggle = () => {
    setLogin(!login);
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        top: "9rem",
      }}
    >
      <Box
        sx={{
          bgcolor: "#181818",
          padding: 10,
          borderRadius: 5,
          display: "flex",
          height: "100%",
          flexDirection: "column",
          boxShadow: 5,
          gap: 2,
        }}
      >
        {!login && (
          <FormControl>
            <Input
              placeholder="Name"
              type="text"
              value={userdata.name}
              sx={{ color: "white" }}
              onChange={(e) =>
                setuserData({ ...userdata, name: e.target.value })
              }
            />
          </FormControl>
        )}
        <FormControl>
          <Input
            placeholder="Email"
            sx={{ color: "white" }}
            type="text"
            value={userdata.email}
            onChange={(e) =>
              setuserData({ ...userdata, email: e.target.value })
            }
          />
        </FormControl>
        <FormControl>
          <Input
            placeholder="Password"
            sx={{ color: "white" }}
            type="password"
            value={userdata.password}
            onChange={(e) =>
              setuserData({ ...userdata, password: e.target.value })
            }
          />
        </FormControl>
        <p
          className={ubunto.className}
          style={{ fontSize: 20, marginTop: 10, color: "white" }}
        >
          {login ? "Don't have an account?" : "Already have an account?"}
          <span style={{ cursor: "pointer" }} onClick={handleToggle}>
            {login ? " Create" : " Login"}
          </span>
        </p>

        {Error && <p>{Error}</p>}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" onClick={handleClick} sx={{ bottom: 5 }}>
            {login ? " Login" : " Create"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
