import React from "react";
import Layout from "./layout";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Login from "./Components/Login/Login";
import { postApi } from "./_api/_api";

function authWrapper(props: any) {
  const token = localStorage.getItem("token") || "";

  const schema = Yup.object().shape({
    userId: Yup.string().required("Field is required"),
    password: Yup.string().required("Field is required"),
  });

  const formik = useFormik({
    initialValues: {
      userId: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (value: any) => {
      const { status, body } = await postApi("/auth/login", value);
      if (status === 200) {
        localStorage.setItem("token", body.data.token);
      }
    },
  });

  if (!token) {
    return <Login formik={formik} />;
  }

  return <Layout>{props.children}</Layout>;
}

export default authWrapper;
