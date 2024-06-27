import axios from 'axios'
import { appRedirection } from "@/utils/appFunctions";
import { Android_CODE_ARR, IOS_CODE_ARR } from "@/utils/commonFunc";
import { trackingDashboardAPI } from '@/utils/api';

export async function companySearchApi(data) {
  const response = await axios({
    method: "post",
    url: "/api/v1/dc/companySearch",
    data: data
  });
  return response
}

export async function updateDcDetailsApi(data) {
  const response = await axios({
    method: "post",
    url: "/api/v1/dc/updatedcdetails",
    data: data
  });
  return response
}

export async function areaSearchApi(data) {
  const response = await axios({
    method: "post",
    url: "/api/v1/dc/areaSearch",
    data: data
  });
  return response
}

export async function getdcdetailsApi(data) {
  const response = await axios({
    method: "post",
    url: "/api/v1/dc/getdcdetails",
    data: data
  });
  return response
}

export async function checkGlobalValidationApi(data) {
  const response = await axios({
    method: "post",
    url: "/api/v1/dc/globalcheck",
    data: data
  });
  return response
}

export function redirectToEditListing(docid, data_city, company_name, sourceCode = 2) {
  let url = `https://wap.justdial.com/edit_list/index.php?cont=${encodeURIComponent(company_name)}&city=${encodeURIComponent(data_city)}&docid=${encodeURIComponent(docid)}&owner=0&wap=${sourceCode}&source=${sourceCode}&hide_header=1&htl=0`
  if (Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) {
    appRedirection(url + '&hide_header=1', sourceCode)
  } else {
    window.location.assign(url)
  }
}

export function generateYears(startYear) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = startYear; i <= currentYear; i++) {
    years.push(i);
  }
  return years.sort((a, b) => b - a);
}

export async function handleDcLogData(payload) {
  const {sourceCode = "", lat = "", long = "", clickType = "", IP = "", mobile = "", docid = "", city = "", current_url = "", navigator = ""} = payload
  let trackingDataPayload = {
    source: sourceCode,
    clickType: clickType,
    IP: IP,
    trace: JSON.stringify({ "useragent": navigator, lat, long }),
    mobile: mobile,
    docid: docid,
    city: city,
    module: "dc"
  }
  try {
    await trackingDashboardAPI(trackingDataPayload, current_url || "");
  } catch (error) {
    console.log("log data error", error.message)
  }
}

