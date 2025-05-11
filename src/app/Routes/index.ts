import express from "express";
import { userRoute } from "../modules/User/user.route";
import { adminRoute } from "../modules/Admin/admin.route";
import { authRoute } from "../modules/Auth/auth.route";
import { specialtiesRoute } from "../modules/Specialties/specialties.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/admins",
    route: adminRoute,
  },
  {
    path: "/doctors",
    route: adminRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/specialties",
    route: specialtiesRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
