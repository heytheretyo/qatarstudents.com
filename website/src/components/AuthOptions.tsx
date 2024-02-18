const AuthOptions = () => {
  const googleLogin = () => {
    console.log(process.env.REACT_APP_GOOGLE_CLIENT_REDIRECT);
    const googleAuthURL = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GOOGLE_CLIENT_REDIRECT}&scope=profile+email`;
    window.open(googleAuthURL, "_blank");
  };

  return (
    <>
      <button onClick={googleLogin} className="mb-3.5">
        continue with google
      </button>
    </>
  );
};

export default AuthOptions;
