const { trackingDashboardAPI } = require("./utils/api");

self.onmessage = function (event) {
  const { sourceCode = "", lat = "", long = "", clickType = "", IP = "", mobile = "", docid = "", city = "", current_url = "", navigator = "" } = event?.data
  handleLogData(sourceCode, lat, long, clickType, IP, mobile, docid, city, current_url, navigator)
    .then(res => {})
    .catch((e) => {
      console.log(e.message)
    })
};

function handleLogData(sourceCode = "", lat = "", long = "", clickType = "", IP = "", mobile = "", docid = "", city = "", current_url = "", navigator = "") {
  let trackingDataPayload = {
    source: sourceCode,
    clickType: clickType,
    IP: IP,
    trace: JSON.stringify({ "useragent": navigator, lat, long }),
    mobile: mobile,
    docid: docid,
    city: city,
    module:"dc"
  }
  try {
    trackingDashboardAPI(trackingDataPayload, current_url || "");
  } catch (error) {
    console.log("log data error", error.message)
  }
}