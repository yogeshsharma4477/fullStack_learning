import axios from "axios";

export async function PostAddressAPI(data) {
    const response = await axios({
        method: "post",
        url: "/api/v1/InsertAPI",
        data: data
    });
    return response
}

export async function PostAddBussinessAPI(data) {
    const response = await axios({
        method: "post",
        url: "/api/v1/InsertAPI",
        data: data
    });
    return response
}

export async function dummy() {
    const response = await axios({
        method: "get",
        url: "/api/v1/dummy",
    });
    return response
}

export async function GetPincodeLocationAPI(pincode) {
    const response = await axios({
        method: "post",
        url: "/api/v1/GetPincodeLocation",
        data: { "pincode": pincode },
        headers: { "Content-Type": "application/json" },
        json: true

    });
    return response
}

export async function ValidateAddressAPI(data) {
    const response = await axios({
        method: "post",
        url: "/api/v1/AddressValidation",
        data: data,
        // headers: { "Content-Type": "application/json" },
    });
    return response
}

export async function GenerateParentId(data) {
    const response = await axios({
        method: "post",
        url: "/api/v1/GenerateParentId",
        data: data,
        headers: { "Content-Type": "application/json" },
    });
    return response
}


export async function GetState(data) {
    const response = await axios({
        method: "post",
        url: "/api/v2/getStateFromCity",
        data: data,
        headers: { "Content-Type": "application/json" },
    });
    return response
}