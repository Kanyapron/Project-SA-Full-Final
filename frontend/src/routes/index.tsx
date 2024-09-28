import { useRoutes, RouteObject } from "react-router-dom";

import MemberRoutes from "./MemberRoutes"
import MainRoutes from "./MainRoutes";



function ConfigRoutes() {

  const isLoggedIn = localStorage.getItem("isLogin") === "true";

  let routes: RouteObject[] = [];


  if (isLoggedIn) {

    routes = [...MemberRoutes(isLoggedIn), ...MainRoutes()];


  } else {

    routes = MainRoutes();

  }

  return useRoutes(routes);

}


export default ConfigRoutes;