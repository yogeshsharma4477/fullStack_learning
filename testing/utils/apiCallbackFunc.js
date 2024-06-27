export async function isLegalBusinessNameCallBackFunc({ responce }) {
    return !!(responce?.data?.success || false)
}

export async function isBadWordCallBackFunc({ responce }) {
    return responce?.data || null
    // return !!(responce?.data?.success || false);
}

export async function sendOTPCallBackFunc({ responce }) {
    return !!(responce?.data?.success || false)
}

export async function sendOTPWebCallBackFunc({ responce }) {
    return responce?.data?.sent
}

export async function verifyOTPCallBackFunc({ responce }) {
    return {
        sid: responce?.data?.results?.ln?.sid,
        status: !!(responce?.data?.success || false),
        islimit: responce?.data?.islimit,
    }
}

export async function verifyOTPWebCallBackFunc({ responce }) {
    return { match: responce?.data?.match, islimit: responce?.data?.islimit }
}

export async function bussinessListCallBackFunc({ responce }) {
    return responce
}

export async function hotleadCallBackFunc({ responce }) {
    return !!(responce?.data?.success || false)
}

export async function isValidPincodeCallBackFunc({ responce }) {
    return responce
}

export async function isValidOrderIdCheck({ responce }) {
    return responce
}

export async function sendOrderPlanCB({ responce }) {
    return responce
}
