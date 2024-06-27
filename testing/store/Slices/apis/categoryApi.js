import axios from "axios";

export async function mainCategoryApi(keyword) {
  try {
    const categories = await axios.post(`/api/v1/mainCategory/${keyword}`);
    return categories.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function fetchSuggestedCategory(keyword, city, ncid) {
  try {
    const categories = await axios.get(
      `/api/v1/subCategory/${keyword}?city=${"mumbai"}&ncid=${ncid}`
    );
    return categories.data;
  } catch (error) {
    return error;
  }
}
