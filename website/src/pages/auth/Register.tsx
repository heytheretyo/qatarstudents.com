import AuthOptions from "../../components/AuthOptions";
import RegisterForm from "../../components/RegisterForm";

function Login() {
  return (
    <>
      <div className="flex flex-col pt-8 px-7">
        <AuthOptions />
        <RegisterForm />
      </div>
    </>
  );
}

export default Login;
