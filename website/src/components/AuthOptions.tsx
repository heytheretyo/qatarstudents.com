const AuthOptions = () => {
  const googleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  return (
    <>
      <a
        href={"http://localhost:5000/api/v1/auth/google"}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3.5"
      >
        continue in with google
      </a>
    </>
  );
};

export default AuthOptions;
