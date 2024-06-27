import { isNull, isEmptyString } from "./commonFunc";

export const isValidMobileNumber = (number = null) => {
    let mobileNumberRegex = new RegExp(/^[6-9]\d{9}$/);
    // .replace(/\+91/,'').replace(/[^\d]/g,''

    if (isNull(number)) return false;
    number = number.replace(/\+91/, '').replace(/[^\d]/g, '')
    if (mobileNumberRegex.test(number)) return true;

    return false;
}

export const isFieldEmpty = (value = null) => {

    if (isNull(value)) return true
    if (isEmptyString(value)) return true

    return false
}

export const isOnlyNumber = (num) => {
    const regexs = /^[0-9]*$/g
    return num.toString().match(regexs)
}

export const isValidEmailId = (email = null) => {
    let validRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email.match(validRegex) ? true : false
}

export const getImageResolution = (file) => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = function () {
            resolve({ completed: img.complete, width: img.width, height: img.height });
        }
        img.onerror = function () {
            resolve({ error: true });
        }
    })
}


export const checkForCameraPermissions = () => {
    try {
        if (window.webkit && window.webkit.messageHandlers['callbackHandler']) {
            window.webkit.messageHandlers['callbackHandler'].postMessage(
                JSON.stringify({ type: 'cameraPermissions' })
            )
        } else if (window.JdLiteInterface) {
            window.JdLiteInterface.getCameraPermission(
                JSON.stringify({ fn: 'uploadImagePermission' })
            )
        }
    } catch (e) {
        console.log(e)
    }
}

