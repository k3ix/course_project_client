import axios from "axios";

export const createOverview = async (data) => {
    axios.post("https://course-project-itransition.herokuapp.com/overviews/createOverview", data).then((res) => {
        return res;
    });
};

export const userOverviews = async (userId) => {
    const res = await axios.get(`https://course-project-itransition.herokuapp.com/overviews/${userId}`);
    console.log(res.data);
    return res.data;
};