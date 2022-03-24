import axios from "axios";

export const getCommentsApi = async (overviewId) => {
    const res = await axios.get(`https://course-project-itransition.herokuapp.com/comments/${overviewId}`);
    return res.data;
};

export const addCommentApi = async (username, commentBody, overviewId, userId, accessToken) => {
    const res = await axios.post('https://course-project-itransition.herokuapp.com/comments/', {
        username: username,
        commentBody: commentBody,
        OverviewId: overviewId,
        UserId: userId
    }, { headers: { accessToken: accessToken } });
    return res.data;
};

export const deleteCommentApi = async (id, accessToken) => {
    const res = await axios.delete(`https://course-project-itransition.herokuapp.com/comments/${id}`,
        { headers: { accessToken: accessToken } });
    return res.data;
}