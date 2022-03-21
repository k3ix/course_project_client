import axios from "axios";

export const addTagsApi = async (tags) => {
    axios.post("https://course-project-itransition.herokuapp.com/tags/addTags", tags).then((response) => {
        return response.data;
    });
};

export const getTagsApi = async () => {
    const response = await axios.get("https://course-project-itransition.herokuapp.com/tags");
    return response.data;
}