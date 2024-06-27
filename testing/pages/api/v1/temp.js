import axios from "axios";

export default async function badword(req, res) {
    try{
        return res.status(200).json({ results: error, message: "Something went wrong.", success: false });
    } catch(error){
        return res.status(500).json({ results: error, message: "Something went wrong.", success: false });
    }
}