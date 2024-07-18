import authenticateJWT from "@/utils/middleware";
import axios from "axios";
var CryptoJS = require("crypto-js");

function areAllValuesNumbers(inputString) {
    const values = inputString.split(','); // Split the input string by commas
    for (const value of values) {
      if (!/^\d+$/.test(value.trim())) {
        return false; // If any value is not a number, return false
      }
    }
    return true; // If all values are numbers, return true
}

async function badword(req, res) {
    let hr24CatObj = null;
    let encryptedCode = '';
    let salt = 'zhsmaj3GKL2CulM0v4KQWgumwVCTKOzy';
    try{
        const  { parentid, all_catidlist, city } = req.body;
        
        let url = '';
        url+=`parentid=${parentid}`;
        url+=`&data_city=${encodeURIComponent(city)}`;
        url+='&ucode=';
        url+=`&all_catidlist=${encodeURIComponent(all_catidlist)}`; 
        url+="&module=ME&post_data=1";
        if(!areAllValuesNumbers(all_catidlist)){
            return res.status(200).json({ result: encryptedCode, status: 'success', data: {} });
        }
        
        axios.get(url)
        .then((responce)=>{
            let Hr24Obj = responce?.data?.CANPROCEED?.popupmsg1 || null;
            if(Hr24Obj?.message == '_24hrsTagged') {
                const catlist = Hr24Obj['_24hrsCategory'].split('|~|');
                hr24CatObj = {
                    type: '24HrCat',
                    catListName: catlist
                }
            }
            if(!responce?.data?.BLOCK?.message){
                let temp_all_catidlist = all_catidlist.replace(/\s/g, '');
                let urlCheck2 = ``;
                urlCheck2+=`national_catid=${encodeURIComponent(temp_all_catidlist)}`;
                urlCheck2+=`&city=${encodeURIComponent(city)}`;
                urlCheck2+='&rest_cat=1';   
                axios.get(urlCheck2)
                .then((responceval)=>{
                    let encriptionMsg = all_catidlist + 'false'
                    let responceObj = responceval?.data?.results?.data || {}
                    if(!Object.keys(responceObj)?.length){
                        let encriptionMsg = all_catidlist + 'true'
                        encryptedCode = CryptoJS.AES.encrypt(encriptionMsg, salt).toString();
                        return res.status(200).json({ result: encryptedCode, status: 'success', hr24CatObj: hr24CatObj, data: responceval?.data || {}, genericData : responce?.data || null });
                    } else {
                        encryptedCode = CryptoJS.AES.encrypt(encriptionMsg, salt).toString();
                        return res.status(200).json({ result: encryptedCode, status: 'success', hr24CatObj1: hr24CatObj, data: responceval?.data || {} });
                    }
                })
                .catch((err)=>{
                    let encriptionMsg = all_catidlist + 'false'
                    encryptedCode = CryptoJS.AES.encrypt(encriptionMsg, salt).toString();
                    return res.status(200).json({ result: encryptedCode, status: 'success', data: err || {} });
                })
            } else {
                let encriptionMsg = all_catidlist + 'false'
                    encryptedCode = CryptoJS.AES.encrypt(encriptionMsg, salt).toString();
                    return res.status(200).json({ result: encryptedCode, status: 'success', data: responce?.data || {} });
            }
        })
        .catch((err)=>{
            let encriptionMsg = all_catidlist + 'false'
            encryptedCode = CryptoJS.AES.encrypt(encriptionMsg, salt).toString();
            return res.status(200).json({ result: encryptedCode, status: 'success', data: err || {} });
        })
    } catch(error){
        console.log("error", error);
        let encriptionMsg = '' + 'false'
        encryptedCode = CryptoJS.AES.encrypt(encriptionMsg, salt).toString();
        return res.status(200).json({ result: encryptedCode, status: 'success', data: error || {} });
    }
}

export default authenticateJWT(badword)
