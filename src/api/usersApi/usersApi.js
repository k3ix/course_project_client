import axios from "axios";

export const userById = async (userId) => {
    const response = await axios.get(`https://course-project-itransition.herokuapp.com/users/byId/${userId}`, userId);
    return response.data;
};

export const userList = async () => {
    const response = await axios.get('https://course-project-itransition.herokuapp.com/users')
    return response.data;
};

export const blockUsersApi = async (blockIds) => {
    axios.put("https://course-project-itransition.herokuapp.com/users/blockUsers", blockIds).then((response) => {
        return response.data;
    });
};

export const unblockUsersApi = async (unblockIds) => {
    axios.put("https://course-project-itransition.herokuapp.com/users/unblockUsers", unblockIds).then((response) => {
        return response.data;
    });
};

export const setAdminApi = async (adminIds) => {
    axios.put("https://course-project-itransition.herokuapp.com/users/setAdmin", adminIds).then((response) => {
        return response.data;
    });
};

export const deleteUsersApi = async (deleteIds) => {
    axios.put("https://course-project-itransition.herokuapp.com/users/deleteUsers", deleteIds).then((response) => {
        return response.data;
    });
}