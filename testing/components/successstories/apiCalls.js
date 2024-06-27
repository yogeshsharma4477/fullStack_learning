import axios from "axios";

export async function GetVideos() {
    const response = await axios({
        method: "get",
        url: "/api/v2/successStories",
    });
    return response
}