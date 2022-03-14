import axios from "axios";

export const createOverview = async (data) => {
    axios.post("http://localhost:3001/overviews/createOverview", data).then((res) => {
        return res;
    })
}