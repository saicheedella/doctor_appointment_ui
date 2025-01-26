import axios from "axios";
import constants from "../constants";

let getConfig = 'http://localhost:8000/';

const api = (method, url, data = null, token = null) => {
  if (token) {
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      credentials: true
    };
  }
  return axios({
    method: method,
    url: `${getConfig}${url}`,
    data: data
  })
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
};

export const login = data => {
  return api("post", constants.API.LOGIN, data)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      throw err;
    });
};

export const register = (data) => {
  return api('post', constants.API.REGISTER, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getUserTypes = () => {
  return api('GET', constants.API.GETUSERTYPES)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getDepartments = () => {
  return api('GET', constants.API.GETDEPARTMENTS)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getDoctors = (data) => {
  return api('POST', constants.API.GETDOCTORS, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const editUser = (data) => {
  return api('POST', constants.API.UPDATEUSER, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getSlots = (data) => {
  return api('POST', constants.API.GETSLOTS, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const bookAppointment = (data) => {
  return api('POST', constants.API.BOOKSLOT, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getAppointments = (data) => {
  return api('POST', constants.API.APPOINTMENTS, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const savePrescription = (data) => {
  return api('POST', constants.API.SAVEPRESCRIPTION, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const uploadUserPic = (data, id) => {
  return api('POST', `${constants.API.UPLOAD}${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};