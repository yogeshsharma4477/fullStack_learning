import { getCookie } from '@/utils/commonFunc';
import React, { useEffect } from 'react';
import { getdcdetailsApi } from './commonAPI';
import { updateMultipleState } from '@/store/Slices/dc/landing';
import { useDispatch, useSelector } from 'react-redux';
import { updateCommonValues } from '@/store/Slices/commonDataSlice';

export function useFetchDataFromDb() {
    const dispatch = useDispatch()
    const dc_slice = useSelector(state => state?.dcLandingSlice)
    useEffect(() => {
        let token = getCookie("dcToken")
        if (!token) return;
        getdcdetailsApi({}).then(res => {
            let response = res.data.results[0]
            if (response) {
                const { area = "", business_name = "", city = "", pincode = "",
                    vendor_title = "", vendor_contact_name = "", vendor_mobile_number = "", vendor_landline = "", state = "", vendor_std_code = "" } = response
                    console.log(response,"state");
                let payload = {};
                if (area?.length && !dc_slice?.area?.length) payload["area"] = area;
                if (business_name?.length && !dc_slice?.businessName?.length) payload["businessName"] = business_name;
                if (city?.length && !dc_slice?.city?.length) payload["city"] = city;
                if (pincode?.length && !dc_slice?.pincode?.length) payload["pincode"] = pincode;
                if (vendor_title?.length && !dc_slice?.title?.length) payload["title"] = vendor_title;
                if (vendor_contact_name?.length && !dc_slice?.contactPerson?.length) payload["contactPerson"] = vendor_contact_name;
                if (vendor_mobile_number?.length && !dc_slice?.mobile_number?.length) payload["mobile_number"] = vendor_mobile_number.split(",")
                if (vendor_landline?.length && !dc_slice?.landline_number?.length) payload["landline_number"] = vendor_landline.split(",")
                if (state?.length && !dc_slice?.state?.length) payload["state"] = state
                if (vendor_std_code?.length && !dc_slice?.stdcode?.length) payload["stdcode"] = vendor_std_code
                if (vendor_mobile_number?.length) {
                    dispatch(updateCommonValues({ key: 'mobileNumber', value: vendor_mobile_number.split(',')[0] }))
                }
                dispatch(updateMultipleState(payload))
            }
        }).catch(error => {
            console.log("db fetch erro", error.message);
        })
    }, [])

    return <></>
}