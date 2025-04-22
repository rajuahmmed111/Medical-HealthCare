import express from "express";
import { userRoute } from "../modules/User/user.route";
import { adminRoute } from "../modules/Admin/admin.route";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;