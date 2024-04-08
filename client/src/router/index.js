import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../components/Dashboard.vue";
import Log from "../components/Log.vue";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/log",
    name: "Log",
    component: Log,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
