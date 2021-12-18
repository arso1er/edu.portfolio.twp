import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    // route level code-splitting
    // this generates a separate chunk (register.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Register.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/cats/add",
    name: "AddCat",
    component: () => import("../views/AddCat.vue"),
  },
  {
    path: "/cats/:id/edit",
    name: "EditCat",
    component: () => import("../views/EditCat.vue"),
  },
  {
    path: "/cats/:id/add",
    name: "AddPost",
    component: () => import("../views/AddPost.vue"),
  },
  {
    path: "/posts/:id",
    name: "ShowPost",
    component: () => import("../views/ShowPost.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("../views/Error404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
