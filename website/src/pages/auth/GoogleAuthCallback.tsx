import { useEffect } from "react";
import { useCookies } from "react-cookie";

function GoogleAuthCallback() {
  const [cookies, setCookie] = useCookies(["access_token", "refresh_token"]);

  useEffect(() => {
    const fetchTokens = async (code: string) => {
      try {
        const apiRoute = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(
          `${apiRoute}auth/google/callback?code=${code}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const res = await response.json();

        if (res.message === "invalid code query") {
          return;
        }

        setCookie("access_token", res.access_token, {
          maxAge: 60 * 60 * 1000,
          path: "/",
          sameSite: "lax",
        });
      } catch (e) {
        console.log(e);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchTokens(code).catch(console.error);
    }
  }, [setCookie]);

  return (
    <div className="pt-8 px-7">
      <h1>login success, you can proceed</h1>
      <h1>{JSON.stringify(cookies)}</h1>
    </div>
  );
}

export default GoogleAuthCallback;
