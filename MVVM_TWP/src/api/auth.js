import axios from "axios";

// https://serversideup.net/build-an-api-wrapper-with-vuejs-axios/
const apiBaseURL = "http://127.0.0.1:8000/?rest_route=/simple-jwt-login/v1";

export default {
  async getAdminToken() {
    const data = {
      username: "admin",
      password: "admin",
    };
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:8000/wp-json/jwt-auth/v1/token`,
      data,
    });
    return res.data.token;
  },
  async register(data) {
    const token = await this.getAdminToken();
    const resRegister = await axios({
      method: "POST",
      url: `http://127.0.0.1:8000/wp-json/wp/v2/users`,
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
      url: `http://127.0.0.1:8000/wp-json/jwt-auth/v1/token`,
      data,
    });
    const userRes = await axios({
      method: "GET",
      url: `http://127.0.0.1:8000/wp-json/wp/v2/users/${res.data.id}`,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ...res.data, avatar: userRes.data.avatar_urls };
  },
};
