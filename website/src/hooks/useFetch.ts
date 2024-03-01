import axios from "axios";
import React, { useState } from "react";
import { Cookies, useCookies } from "react-cookie";
import axiosInstance from "../utils/fetch";

interface IUseFetch {
  path: string;
  method: string;
}

// used to fetch data such as feeds, comments, blogs, posts
const useFetch = (
  args: IUseFetch,
  token: string | undefined
): [
  () => Promise<void>,
  React.Dispatch<React.SetStateAction<string>>,
  string,
  Record<string, any> | null | undefined
] => {
  const [status, setStatus] = useState<string>("idle");
  const [responseData, setData] = useState<Record<string, any> | null>();

  const fetchData = async (): Promise<void> => {
    setStatus("fetching");

    try {
      if (!token) {
        throw new Error("Access token is missing.");
      }

      const delayDuration = Math.floor(Math.random() * 1000);
      await new Promise((resolve) => setTimeout(resolve, delayDuration));

      const res = await axiosInstance.get(args.path, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      setData(res.data);
      setStatus("successful");

      console.log(status);
    } catch (error) {
      console.error("Error fetching data:", error);
      setStatus("failed");
    }
  };

  return [fetchData, setStatus, status, responseData];
};

export default useFetch;
