import AuthOptions from "../../components/AuthOptions";
import LoginForm from "../../components/LoginForm";

function Login() {
  return (
    <>
      <div className="flex flex-col pt-8 px-7">
        <AuthOptions />
        <LoginForm />
      </div>
    </>
  );
}

export default Login;
