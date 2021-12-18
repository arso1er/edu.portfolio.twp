export default {
  loadUser(state) {
    state.user = JSON.parse(localStorage.getItem("user")) || null;
  },
  login(state, user) {
    state.user = user;
  },
  logout(state) {
    state.user = null;
    localStorage.removeItem("user");
  },
  getCats(state, cats) {
    state.cats = cats;
  },
  getPosts(state, { catId, posts }) {
    state["posts" + catId] = posts;
    localStorage.setItem("posts" + catId, JSON.stringify(posts)); // For order persist from localStorage (draggable). Could've done it elsewhere, but I like it here.
  },

  getNotes(state, notes) {
    state.notes = notes;
  },
  getNote(state, note) {
    state.note = note;
  },
  setEditNoteTitle(state, newValue) {
    state.editNoteTitle = newValue;
  },
  setEditNoteContent(state, newValue) {
    state.editNoteContent = newValue;
  },
  reverseNotes(state) {
    const newNotes = [...state.notes];
    newNotes.reverse();
    state.notes = newNotes;
  },
  setNotes(state, newValue) {
    state.notes = newValue;
  },
};
