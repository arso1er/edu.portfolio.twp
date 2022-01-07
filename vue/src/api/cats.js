import axios from "axios";
import getToken from "./token";
import { apiURL } from "./config";
// https://serversideup.net/build-an-api-wrapper-with-vuejs-axios/
const apiBaseURL = `${apiURL}/wp-json/wp/v2/categories`;
// function getToken() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   if (user) {
//     return user.token;
//   }
//   return "";
// }

export default {
  async index() {
    const res = await axios({
      method: "GET",
      url: apiBaseURL + "?orderby=id&order=asc",
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