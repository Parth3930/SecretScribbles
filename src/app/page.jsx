"use client";
import { Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Redirect() {
  const { push } = useRouter();

  useEffect(() => {
    const loggedIn = Cookies.get("loggedIn");
    if (!loggedIn) {
      push("/login");
    } else {
      push("/home");
    }
  }, []);

  return <Fragment />;
}
