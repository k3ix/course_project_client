import axios from "axios";

export const userById = async (userId) => {
    const response = await axios.get(`https://course-project-itransition.herokuapp.com/users/byId/${userId}`, userId);
    return response.data;
};

export const userList = async () => {
    const response = await axios.get('https://course-project-itransition.herokuapp.com/users')
    return response.data;
}