"use client";
import { Fragment, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import "./page.css";
import { Box, Button, Typography } from "@mui/material";
import CardCreate from "@/componants/cardCreate";
import Card from "@/componants/card";
import NaviBar from "@/componants/nav";
import {
  fetchUserData,
  fetchUserCards,
  deleteUserCard,
} from "@/utils/supabaseService";

export default function Home() {
  const { push } = useRouter();
  const [userData, setUserData] = useState(null);
  const [card, setCard] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      const token = Cookies.get("login");
      if (!token) return;

      const data = await fetchUserData(token);
      if (data) {
        setUserData(data);
      } else {
        push("/login");
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const getUserCards = async () => {
      const cards = await fetchUserCards();
      setCard(cards);
    };

    getUserCards();
  }, []);

  const handleNewCard = (newCard) => {
    // Insert the new card after the first two cards
    const updatedCards = [card[0], card[1], newCard, ...card.slice(2)];
    setCard(updatedCards);
  };

  const handleDelete = async (id) => {
    const isDeleted = await deleteUserCard(id);
    if (isDeleted) {
      const cards = await fetchUserCards();
      setCard(cards);
    }
  };

  if (!userData) {
    return (
      <Fragment>
        <NaviBar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 1,
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            Please Login To upload
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              push("/login");
            }}
          >
            Login
          </Button>
          <Box
            sx={{
              marginTop: "2.5rem",
              display: "flex",
              justifyContent: "center",
              width: "96%",
              gap: 2,
              flexWrap: "wrap",
              flex: "1 1 0",
              marginX: 2,
              marginBottom: 2,
            }}
          >
            {card.map((card) => (
              <Card key={card.id} data={card} />
            ))}
          </Box>
        </Box>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <NaviBar />
      <Typography
        variant="h6"
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: { xs: 0, md: 2 },
          color: "white",
        }}
      >
        Whats on your mind today, {userData.name}?
      </Typography>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <CardCreate data={userData} handle={handleNewCard} />
      </Box>
      <Box
        sx={{
          marginTop: "2.5rem",
          display: "flex",
          justifyContent: "center",
          width: "96%",
          gap: 2,
          flexWrap: "wrap",
          flex: "1 1 0",
          marginX: 2,
          marginBottom: 2,
        }}
      >
        {card.map((card) => (
          <Card
            key={card.id}
            data={card}
            user={userData}
            handle={handleDelete}
          />
        ))}
      </Box>
    </Fragment>
  );
}