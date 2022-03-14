import axios from "axios";

export const addTags = async (tags) => {
    axios.post("http://localhost:3001/tags/addTags", tags).then((response) => {
        return response.data;
    });
};

export const getTags = async () => {
    const response = await axios.get("http://localhost:3001/tags");
    return response.data;
}