import axios from "axios";

export const addTags = async (tags) => {
    axios.post("https://course-project-itransition.herokuapp.com/tags/addTags", tags).then((response) => {
        return response.data;
    });
};

export const getTags = async () => {
    const response = await axios.get("https://course-project-itransition.herokuapp.com/tags");
    return response.data;
}