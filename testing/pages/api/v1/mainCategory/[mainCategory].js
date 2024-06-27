import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function mainCategory(req, res) {

  const { data_city='mumbai'} = req?.body || {};
  try {

    // `http://192.168.131.24/autoSearch?string=${req.query.mainCategory}&act=category&city=${data_city}&module=&mod=JDA`
    const categories = await axios.get(
      `http://192.168.131.24/autoSearch?string=${req.query.mainCategory}&act=category&city=${data_city}&module=&mod=JDA`
      // `${process.env.MAIN_CATEGORY}?dcity=${data_city}&scity=${data_city}&search=${req.query.mainCategory}`
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
