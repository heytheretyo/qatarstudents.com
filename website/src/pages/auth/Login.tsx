import React from "react";
import LoginForm from "../../components/LoginForm";

function Login() {
  return (
    <>
      <div className="flex pt-8 px-7">
        <LoginForm />
        {/* <input
          type="text"
          placeholder="my username is 1234"
          className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 border rounded appearance-none border- focus:outline-none focus:bg-white"
        />
        <input
          type="text"
          placeholder="not showing my password"
          className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 border rounded appearance-none border- focus:outline-none focus:bg-white"
        />

        <button
          type="submit"
          className="px-8 py-2 mb-2 font-bold text-white bg-blue-500 border-b-4 border-blue-700 rounded-full hover:bg-blue-700"
        >
          login
        </button>
        <button
          type="submit"
          className="px-8 py-2 font-bold text-white bg-blue-500 border-b-4 border-blue-700 rounded-full hover:bg-blue-700"
        >
          login with google
        </button> */}
      </div>
    </>
  );
}

export default Login;
