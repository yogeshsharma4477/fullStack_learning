export const sourceMap = {
    1: '1',
    2: '2',
    3: '3',
    7: '7',
    77: '77',
    51: '51',
    52: '52',
    53: '53',
    57: '57',
}

export const handleInvalidUser = (source) => {
    let url
    let redirectParam
    if (process.env.APP_ENV === 'development') {
        url = 'http://project01.anilkumar.jdsoftware.jd:5663'
        redirectParam = 'redirectionurl'
    } else if (process.env.APP_ENV === 'staging') {
        if (
            source == '7' ||
            source == '77' ||
            source == '27' ||
            source == '57'
        ) {
            url = 'https://staging2.justdial.com'
            redirectParam = 'redirectionurl'
        } else {
            url = 'https://staginglabs.justdial.com'
            redirectParam = 'redirect'
        }
    } else {
        url = 'https://www.justdial.com'
        redirectParam = 'redirectionurl'
    }

    switch (source) {
        case sourceMap['7']:
        case sourceMap['57']:
        case sourceMap['2']:
        case sourceMap['52']:
        case sourceMap['3']:
            window.location.href = `${url}/login?vertical=advertise&${redirectParam}=${encodeURIComponent(
                process.env.basePath + `?source=${source}` + '&from=login'
            )}`
            break
        case sourceMap['1']:
            var logjson = JSON.stringify({ action: 'logout' })
            JdLiteInterface.verticalHandler(logjson)
            break
        case sourceMap['3']:
            var logjson = JSON.stringify({
                type: 'verticalLogin',
                fn: 'getLoginData',
            })
            window.webkit.messageHandlers.callbackHandler.postMessage(logjson)
            break
        default:
            window.location.href = `${url}/login?vertical=advertise&${redirectParam}=${encodeURIComponent(
                process.env.basePath + `?source=${source}` + '&from=login'
            )}`
            break
    }
}
