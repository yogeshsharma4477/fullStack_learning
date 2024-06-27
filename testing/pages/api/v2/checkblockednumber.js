import axios from "axios";

import authenticateJWT from "../../../utils/middleware"

async function checkBlockedNumber(req, res) {
    const { mobile } = req.body;
    try {
        let url = `http://192.168.20.11/free_listing/include/autosuggest_search.php?param=blocknumber&q=${mobile}`

        await axios.get(url)
        .then((response) => {
            if(response?.data==0){
                res.status(200).json({status: true})
            } else{
                res.status(200).json({status: false})
            }
        })
        .catch((err) => {
            res.status(400).json({status: false, error: err.message})
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({status: false, error: error.message})
    }
}

export default authenticateJWT(checkBlockedNumber)

