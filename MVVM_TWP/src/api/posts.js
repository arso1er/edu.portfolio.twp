import axios from "axios";
import getToken from "./token";
// https://serversideup.net/build-an-api-wrapper-with-vuejs-axios/
const apiBaseURL = "http://127.0.0.1:8000/wp-json/wp/v2/posts";

export default {
  async index(catId) {
    const res = await axios({
      method: "GET",
      url:
        apiBaseURL +
        `${catId ? "?categories=" + catId + "&" : "?"}` +
        "orderby=id&order=asc",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    // console.log(res.data);
    // window.t = res.data;
    return res.data;
  },
  async create(data) {
    const res = await axios({
      method: "POST",
      url: apiBaseURL,
      data,
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    // console.log(res.data);
    return res.data;
  },
  async show(id) {
    const res = await axios({
      method: "GET",
      url: apiBaseURL + `/${id}`,
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    // console.log(res.data);
    return res.data;
  },
  async update(id, data) {
    const res = await axios({
      method: "POST",
      url: apiBaseURL + `/${id}`,
      data,
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    // console.log(res.data);
    return res.data;
  },
  async delete(id) {
    const res = await axios({
      method: "DELETE",
      url: apiBaseURL + `/${id}?force=true`,
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    // console.log(res.data);
    return res.data;
  },
};
