import axios from "axios";

export const ratingClickApi = async (overviewId, rating, accessToken) => {
    const response = await axios.post("https://course-project-itransition.herokuapp.com/users-rating",
        { OverviewId: overviewId, rating: rating },
        { headers: { accessToken: accessToken } });
    return response.data;
}