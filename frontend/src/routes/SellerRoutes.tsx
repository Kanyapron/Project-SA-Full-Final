// import { lazy } from "react";

// import { RouteObject } from "react-router-dom";
// import Loadable from "../component/Loadable";


// // import ApplyToSeller from "../pages/Products/ApplyToSeller/ApplyToSeller";


// const MainPages = Loadable(lazy(() => import("../../src/pages/Home/home")));

// // const HomeLogin = Loadable(lazy(() => import("../../src/pages/HomeLogin/homelogin")));

// const HomeSeller = Loadable(lazy(() => import("../pages/Home/Seller/homeseller")));
// const CreateProducts = Loadable(lazy(() => import("../pages/Products/CreateProducts/CreateProducts")));


// const SellerRoutes = (isLoggedIn: boolean): RouteObject[] => {
//   return [
//     {
//       path: "/HomeSeller",
//       element: isLoggedIn ? <HomeSeller /> : <MainPages />,
//     },
//     {
//       path: "/HomeSeller",
//       element: <HomeSeller />,
//     },
  
//     {
//       path: "/CreateProducts",
//       element: <CreateProducts />,
//     },


//   ];
// };

// export default SellerRoutes;