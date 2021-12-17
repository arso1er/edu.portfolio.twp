import NotesAPI from "../api/notes";
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
  async deleteComment({ dispatch, commit }, id) {
    const res = await CommentsAPI.delete(id);
    return res;
  },

  async getNotes({ commit }) {
    let notes;
    try {
      notes = await NotesAPI.index();
      localStorage.setItem("savedNotes", JSON.stringify(notes));
    } catch (error) {
      console.log(error);
      notes = JSON.parse(localStorage.getItem("savedNotes")) || [];
    }
    commit("getNotes", notes);
  },
  async getNote({ commit }, id) {
    // https://stackoverflow.com/a/49998565
    let note;
    try {
      note = await NotesAPI.show(id);
      const singleNotes = JSON.parse(localStorage.getItem("singleNotes")) || [];
      if (note) singleNotes.push(note);
      localStorage.setItem("singleNotes", JSON.stringify(singleNotes));
    } catch (error) {
      console.log(error);
      const singleNotes = JSON.parse(localStorage.getItem("singleNotes")) || [];
      singleNotes.forEach((singleNote) => {
        if (singleNote._id === id) note = { ...singleNote };
      });
      if (!note) {
        const notes = JSON.parse(localStorage.getItem("savedNotes")) || [];
        notes.forEach((singleNote) => {
          if (singleNote._id === id) note = { ...singleNote };
        });
      }
    }

    if (!note) {
      return;
    }

    commit("getNote", note);
    commit("setEditNoteTitle", note.title);
    commit("setEditNoteContent", note.content[0]);
  },
  setEditNoteTitle({ commit }, newValue) {
    commit("setEditNoteTitle", newValue);
  },
  setEditNoteContent({ commit }, newValue) {
    commit("setEditNoteContent", newValue);
  },
  // https://vuex.vuejs.org/guide/actions.html#composing-actions
  async updateNote({ dispatch, commit }, { id, data }) {
    const res = await NotesAPI.update(id, data);
    await dispatch("getNote", res.note_id);
    await dispatch("getNotes");
    return res;
  },
  async createNote({ dispatch, commit }, { data }) {
    const res = await NotesAPI.create(data);
    await dispatch("getNote", res.note_id);
    await dispatch("getNotes");
    return res;
  },
  async deleteNote({ dispatch, commit }, id) {
    const res = await NotesAPI.delete(id);
    await dispatch("getNotes");
    return res;
  },

  reverseNotes({ commit }) {
    commit("reverseNotes");
  },
  setNotes({ commit }, newValue) {
    commit("setNotes", newValue);
  },
};
