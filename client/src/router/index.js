import { createRouter, createWebHistory } from "vue-router";
import apiClient from "axios";

import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";
import NotFound from "../components/NotFound.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) {
      next("/login");
    } else {
      apiClient
        .get("/verifyToken")
        .then(() => {
          next();
        })
        .catch(() => {
          next("/login");
        });
    }
  } else {
    next();
  }
});

export default router;
