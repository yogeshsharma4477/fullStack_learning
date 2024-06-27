
import axios from 'axios'
export async function categoryTrendAPI(payload) {
  const response = await axios({
    method: "post",
    url: "/api/v2/categoryTrend",
    data: payload
  });
  return response
}

export async function leaderBoardAPI(payload) {
  const response = await axios({
    method: "post",
    url: "/api/v2/leaderboard",
    data: payload
  });
  return response
}


export async function areaCityAPI(payload) {
  const response = await axios({
    method: "post",
    url: "/api/v2/areacity",
    data: payload
  });
  return response
}


export async function fetchDropDownData(searchTerm) {
  if (!searchTerm) return null;
  try {
    const response = await axios.post(`/api/v1/mainCategory/${searchTerm}`, {
      data_city: 'mumbai'
    });
    return response.data; // Assuming the response contains data
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}