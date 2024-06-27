import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function subCategory(req, res) {
  try {

    let queyParamObj = {
      city: req.query.city,
      // limit: req.query.limit,
      // category_name: req.query.subCategory,
      cname: req.query.subCategory,
      national_catid: req.query.ncid,
      all_cat: 1,
      // where: JSON.stringify({
      //   city: req.query.city,
      //   // limit: req.query.limit,
      //   // category_name: req.query.subCategory,
      //   cname: req.query.subCategory,
      //   national_catid: req.query.ncid,
      //   all_cat: 1,
      //   // biddable_type: 1,
      //   // mark_status: 0,
      //   // bfc_bifurcation_flag: "!4,5,6,7,8",
      //   // jdmart_flag: 0,
      // }),
    }
    if(req.query.limit) {
      queyParamObj.limit= req.query.limit
    }

    const suggestedcategories = await axios.get(
      // `${process.env.SUB_CATEGORY}?city=mumbai&module=TME&return=catid,national_catid,category_name,budget_type,category_scope,is_restricted&scase=2&trace=&q_type=localinfo&callsrc=genio&limit=${req.query.limit}`,
      `${process.env.SUB_CATEGORY}`,
      {
        params: queyParamObj,
      }
    );
    return res.json(suggestedcategories.data);
  } catch (error) {
    console.log(error);
    return res.json({
      errorCode: 1,
      message: "Error While Fetching Data",
    });
  }
}

export default authenticateJWT(subCategory)


