import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/users?limit=10&page=1",
    },
    {
      path: "/users",
      name: "users",
      component: () => import("@/views/users/index.vue"),
    },
    {
      path: "/swagger",
      name: "swagger",
      component: () => import("@/views/swagger/index.vue"),
    },
    {
      path: "/booking",
      name: "booking",
      component: () => import("@/views/booking/index.vue"),
    },
  ],
});

export default router;
