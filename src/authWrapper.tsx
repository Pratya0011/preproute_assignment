import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { postApi } from "./_api/_api";
import { handleUserDetails } from "./_store/reducer/commonStore";
import Layout from "./layout";

const Login = lazy(() => import("./Components/Login/Login"));

function authWrapper(props: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      if (status >= 400 && status <= 599) {
        enqueueSnackbar("Invalid Credentials", { variant: "error" });
        return;
      }
      if (status === 200) {
        localStorage.setItem("token", body.data.token);
        dispatch(handleUserDetails(body.data.user));
        navigate("/dashboard");
      }
    },
  });

  if (!token) {
    return (
      <Suspense fallback={null}>
        <Login formik={formik} />
      </Suspense>
    );
  }

  return <Layout>{props.children}</Layout>;
}

export default authWrapper;
