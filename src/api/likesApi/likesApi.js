import axios from "axios";

export const likeApi = async (overviewId, accessToken) => {
    const response = await axios.post("https://course-project-itransition.herokuapp.com/likes",
        { OverviewId: overviewId },
        { headers: { accessToken: accessToken } });
    return response.data;
}