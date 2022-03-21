import axios from "axios";

export const createOverviewApi = async (data) => {
    axios.post("https://course-project-itransition.herokuapp.com/overviews/createOverview", data).then((res) => {
        return res;
    });
};

export const editOverviewApi = async (data, overviewId) => {
    axios.post(`https://course-project-itransition.herokuapp.com/overviews/editOverview/${overviewId}`, data)
        .then(res => {
            return res;
        });
};

export const userOverviewsApi = async (userId) => {
    const res = await axios.get(`https://course-project-itransition.herokuapp.com/overviews/${userId}`);
    return res.data;
};

export const deleteOverviewsApi = async (deleteIds) => {
    axios.put("https://course-project-itransition.herokuapp.com/overviews/deleteOverviews", deleteIds).then(res => {
        return res.data;
    });
};

export const overviewByIdApi = async (overviewId) => {
    const res = await axios.get(`https://course-project-itransition.herokuapp.com/overviews/byId/${overviewId}`)
    return res.data;
}