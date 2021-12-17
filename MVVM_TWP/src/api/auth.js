import axios from "axios";

// https://serversideup.net/build-an-api-wrapper-with-vuejs-axios/
const apiBaseURL = "http://127.0.0.1:8000/?rest_route=/simple-jwt-login/v1";

export default {
  async register(data) {
    const { email, password, user_login } = data;
    const res = await axios({
      method: "POST",
      url: `${apiBaseURL}/users&email=${email}&password=${password}&user_login=${user_login}`,
    });
    return res.data;
  },
  async login(data) {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:8000/wp-json/jwt-auth/v1/token`,
      data,
    });
    const userRes = await axios({
      method: "GET",
      url: `http://127.0.0.1:8000/wp-json/wp/v2/users/${res.data.id}`,
      data,
    });
    return { ...res.data, avatar: userRes.data.avatar_urls };
  },
};
