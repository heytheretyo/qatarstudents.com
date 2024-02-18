import { useEffect } from "react";

async function fetchData(code: string) {
  const apiRoute = process.env.REACT_APP_API_BASE_URL;
  const response = await fetch(`${apiRoute}auth/google/callback?code=${code}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return await response.json();
}

function GoogleAuthCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      const data = fetchData(code);

      console.log(data);
    }
  }, []);

  return <h1>login success, you can proceed</h1>;
}

export default GoogleAuthCallback;
