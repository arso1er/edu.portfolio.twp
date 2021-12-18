import AuthAPI from "@/api/auth";
import CatsAPI from "@/api/cats";
import PostsAPI from "@/api/posts";
import CommentsAPI from "@/api/comments";

export default {
  loadUser({ commit }) {
    commit("loadUser");
    return true;
  },
  async login({ commit }, data) {
    const res = await AuthAPI.login(data);
    const user = { ...res, username: data.username };
    localStorage.setItem("user", JSON.stringify(user));
    commit("login", user);
    return user;
  },
  logout({ commit }) {
    commit("logout");
    return true;
  },
  async getCats({ commit }) {
    let cats;
    try {
      cats = await CatsAPI.index();
      localStorage.setItem("cats", JSON.stringify(cats));
    } catch (error) {
      console.log(error);
      cats = JSON.parse(localStorage.getItem("cats")) || [];
    }
    commit("getCats", cats);
  },
  setCats({ commit }, cats) {
    commit("getCats", cats);
  },
  async createCat({ dispatch, commit }, data) {
    const res = await CatsAPI.create(data);
    // await dispatch("getCat", res.note_id);
    // await dispatch("getCats");
    return res;
  },
  async getCat({ dispatch, commit }, id) {
    const res = await CatsAPI.show(id);
    return res;
  },
  async updateCat({ dispatch, commit }, { id, data }) {
    const res = await CatsAPI.update(id, data);
    return res;
  },
  async deleteCat({ dispatch, commit }, id) {
    const res = await CatsAPI.delete(id);
    await dispatch("getCats");
    return res;
  },
  async getPosts({ commit }, catId) {
    let posts;
    try {
      posts = await PostsAPI.index(catId);
      localStorage.setItem("posts" + catId, JSON.stringify(posts));
    } catch (error) {
      console.log(error);
      posts = JSON.parse(localStorage.getItem("posts" + catId)) || [];
    }
    commit("getPosts", { catId, posts });
  },
  setPosts({ commit }, { catId, posts }) {
    commit("getPosts", { catId, posts });
  },
  async createPost({ dispatch, commit }, data) {
    const res = await PostsAPI.create(data);
    // await dispatch("getCat", res.note_id);
    // await dispatch("getCats");
    return res;
  },
  async getPost({ dispatch, commit }, id) {
    const res = await PostsAPI.show(id);
    return res;
  },
  async updatePost({ dispatch, commit }, { id, data }) {
    const res = await PostsAPI.update(id, data);
    return res;
  },
  async deletePost({ dispatch, commit }, id) {
    const res = await PostsAPI.delete(id);
    return res;
  },
  async getComments({ commit }, postId) {
    let comments;
    try {
      comments = await CommentsAPI.index(postId);
      localStorage.setItem("comments" + postId, JSON.stringify(comments));
    } catch (error) {
      console.log(error);
      comments = JSON.parse(localStorage.getItem("comments" + postId)) || [];
    }
    // commit("getPosts", { catId, posts }); // Commented for now. Don't see the need to have this using memory in state.
    return comments;
  },
  async createComment({ dispatch, commit }, data) {
    const res = await CommentsAPI.create(data);
    // await dispatch("getCat", res.note_id);
    // await dispatch("getCats");
    return res;
  },
  async updateComment({ dispatch, commit }, { id, data }) {
    const res = await CommentsAPI.update(id, data);
    return res;
  },
  async deleteComment({ dispatch, commit }, id) {
    const res = await CommentsAPI.delete(id);
    return res;
  },
};
