import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../components/Dashboard.vue";
import QueryLog from "../components/Log.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/log",
    name: "Log",
    component: QueryLog,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
