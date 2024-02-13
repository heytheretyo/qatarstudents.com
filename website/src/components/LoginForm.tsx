import React from "react";

import { useFormik } from "formik";

import * as Yup from "yup";
import axios from "axios";

const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("fill the username"),
      password: Yup.string().required("fill the password"),
    }),

    onSubmit: async (values) => {
      const response = await axios.post(
        `http://localhost:5000/api/v1/auth/login`,
        {
          username: values.username,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response);

      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-2">
        <label htmlFor="username">username</label>

        <input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          placeholder="oryxking360"
          className="block w-full px-4 py-3 leading-tight text-gray-700 border rounded appearance-none border- focus:outline-none focus:bg-white"
        />

        {formik.touched.username && formik.errors.username ? (
          <div className="mt-1 text-red-500">{formik.errors.username}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="password">password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="●●●●●●●●●●●"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className="block w-full px-4 py-3 leading-tight text-gray-700 border rounded appearance-none border- focus:outline-none focus:bg-white"
        />

        {formik.touched.password && formik.errors.password ? (
          <p className="mt-1 text-red-500">{formik.errors.password}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="px-8 py-2 font-bold text-white bg-blue-500 border-b-4 border-blue-700 rounded-full hover:bg-blue-700"
      >
        login
      </button>
    </form>
  );
};

export default LoginForm;
