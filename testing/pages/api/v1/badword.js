import authenticateJWT from "@/utils/middleware";
import axios from "axios";
var CryptoJS = require("crypto-js");

async function badword(req, res) {
    let encryptedCode = '';
    let salt = 'zhsmaj3GKL2CulM0v4KQWgumwVCTKOzy';
    try {
        const { word, city, isApp = false } = req.query;
        let encodedWord = encodeURIComponent(word)

        let queryParam = {
            data_city: city ||'mumbai',
            module: 'Freelisting-Website',
            compname: encodeURIComponent(word),
            source: isApp ? 'Freelisting-App' : 'Freelisting-Website',
            source_id: isApp ? '9704' : '9703'
        }
        queryParam = new URLSearchParams(queryParam).toString()
        let url = `http://${process.env.V2.GLOBAL_COMPANY_API}?${queryParam}`
        
        axios.get(url)
            .then((responce) => {
                let typeErrVal = ''
                if (responce?.data?.block?.msg[0]?.includes('tagged as Slang Word')) {
                    typeErrVal = 'legalword'
                    encryptedCode = CryptoJS.AES.encrypt(`${word}${'true'}`, salt).toString();
                    return res.status(200).json({ results: responce?.data, message: `${word} is valid.`, typeErr: typeErrVal, success: true, word: word, encryptedCode: encryptedCode });
                }
                 else if (responce?.data?.block?.msg[0]?.includes('tagged as Inapt')) {
                    typeErrVal = ''
                    encryptedCode = CryptoJS.AES.encrypt(`${word}${'true'}`, salt).toString();
                    return res.status(200).json({ results: responce?.data, message: `${word} is valid.`, typeErr: typeErrVal, success: true, word: word, encryptedCode: encryptedCode });
                }
                else if (responce?.data?.block?.msg[0]?.includes('tagged as Corporate Legal')) {
                    typeErrVal = 'legalword'
                    encryptedCode = CryptoJS.AES.encrypt(`${word}${'true'}`, salt).toString();
                    return res.status(200).json({ results: responce?.data, message: `${word} is valid.`, typeErr: typeErrVal, success: true, word: word, encryptedCode: encryptedCode });
                }
                else if (responce?.data?.block?.msg[0]?.includes('tagged as Brand Connect')) {
                    typeErrVal = ''
                    encryptedCode = CryptoJS.AES.encrypt(`${word}${'true'}`, salt).toString();
                    return res.status(200).json({ results: responce?.data, message: `${word} is valid.`, typeErr: typeErrVal, success: true, word: word, encryptedCode: encryptedCode });
                }
                else if (responce?.data?.block?.msg[0]?.includes('tagged as Home Key')) {
                    typeErrVal = ''
                    encryptedCode = CryptoJS.AES.encrypt(`${word}${'true'}`, salt).toString();
                    return res.status(200).json({ results: responce?.data, message: `${word} is valid.`, typeErr: typeErrVal, success: true, word: word, encryptedCode: encryptedCode });
                }
                else if (responce?.data?.block?.msg[0]?.includes('tagged as Legal')) {
                    typeErrVal = 'legalword'
                    encryptedCode = CryptoJS.AES.encrypt(`${word}${'true'}`, salt).toString();
                    return res.status(200).json({ results: responce?.data, message: `${word} is valid.`, typeErr: typeErrVal, success: true, word: word, encryptedCode: encryptedCode });
                }
                if (!responce?.data?.block?.msg[0]) {
                    encryptedCode = CryptoJS.AES.encrypt(`${word}${'true'}`, salt).toString();
                    return res.status(200).json({ results: responce?.data, message: `${word} is valid.`, typeErr: typeErrVal, success: true, word: word, encryptedCode: encryptedCode });
                } else {
                    encryptedCode = CryptoJS.AES.encrypt(`${word}${'false'}`, salt).toString();
                    return res.status(200).json({ results: responce?.data, message: `${word} is not valid.`, typeErr: typeErrVal, success: false, word: word, encryptedCode: encryptedCode });
                }
            })
            .catch((err) => {
                console.log("-------------------------------")
                console.log(err)
                encryptedCode = CryptoJS.AES.encrypt(`${word}${'false'}`, salt).toString();
                return res.status(500).json({ results: err, message: "Something went wrong.", typeErr: '', success: false, word: word, encryptedCode: encryptedCode });
            })

    } catch (error) {
        return res.status(500).json({ results: error, message: "Something went wrong.", typeErr: '', success: false, word: null, encryptedCode: encryptedCode });
    }
}

export default authenticateJWT(badword)
