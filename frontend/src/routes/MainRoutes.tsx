import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../component/Loadable";


const MainPages = Loadable(lazy(() => import("../../src/pages/Home/home")));

const LoginPage = Loadable(lazy(() => import("../../src/pages/authentication/Login/Login")));

const SignupPage = Loadable(lazy(() => import("../../src/pages/authentication/Signup/Signup")));

const MainRoutes = (): RouteObject[] => {
  return [
    {
      path: "/",
      element: <MainPages />,
    },
    {
      path: "/Login",
      element: <LoginPage />,
    },
    {
      path: "/SignupPage",
      element: <SignupPage />,
    },
    {
      path: "*",
      element: <MainPages />,
    },
  ];
};


export default MainRoutes;