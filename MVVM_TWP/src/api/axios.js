import axios from "axios";

const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
}

export default axios;
