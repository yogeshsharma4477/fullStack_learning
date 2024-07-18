import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function mainCategory(req, res) {

  const { data_city='mumbai'} = req?.body || {};
  try {

    const categories = await axios.get(
    
    );
    return res.json(categories.data);
  } catch (error) {
    return res.json({
      errorCode: 1,
      message: "Error While Fetching Data",
    });
  }
}

export default authenticateJWT(mainCategory)
