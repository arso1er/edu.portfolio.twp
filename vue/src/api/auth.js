import axios from "axios";
import { apiURL } from "./config";

// https://serversideup.net/build-an-api-wrapper-with-vuejs-axios/

export default {
  async getAdminToken() {
    const data = {
      username: "jefferson",
      password: "jefferson",
    };
    const res = await axios({
      method: "POST",
      url: `${apiURL}/wp-json/jwt-auth/v1/token`,
      data,
    });
    return res.data.token;
  },
  async register(data) {
    const token = await this.getAdminToken();
    const resRegister = await axios({
      method: "POST",
      url: `${apiURL}/wp-json/wp/v2/users`,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(resRegister.data);
    // await this.login(data);
    return resRegister.data;
  },
  async login(data) {
    const token = await this.getAdminToken();

    const res = await axios({
      method: "POST",
      url: `${apiURL}/wp-json/jwt-auth/v1/token`,
      data,
    });
    const userRes = await axios({
      method: "GET",
      url: `${apiURL}/wp-json/wp/v2/users/${res.data.id}`,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ...res.data, avatar: userRes.data.avatar_urls };
  },
};
