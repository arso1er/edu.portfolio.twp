// https://serversideup.net/build-an-api-wrapper-with-vuejs-axios/
const apiBaseURL = "http://5.135.119.239:3090";

export default {
  async index() {
    const res = await fetch(apiBaseURL + "/notes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data.notes;
  },

  async show(id) {
    const res = await fetch(apiBaseURL + `/notes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data.note;
  },

  async update(id, data) {
    // const data = {
    //   title: String,
    //   content: [String],
    // };
    if (!Array.isArray(data.content)) data.content = [data.content];
    const res = await fetch(apiBaseURL + `/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const out = await res.json();
    return out;
  },

  async create(data) {
    if (!Array.isArray(data.content)) data.content = [data.content];
    const res = await fetch(apiBaseURL + `/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const out = await res.json();
    return out;
  },

  async delete(id) {
    await fetch(apiBaseURL + `/notes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return true;
  },
};
