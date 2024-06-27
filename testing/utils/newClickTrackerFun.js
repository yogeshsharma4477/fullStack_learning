export function new_fl_alreadyLoggedin_ct_login(index, page = ""){
    let li = "";
    if(page === "landing"){
      switch (index) {
        case 1:
          li = "OTP_Skip_sn1";
          break;
        case 2:
          li = "OTP_Skip_sn2";
          break;
        case 3:
          li = "OTP_Skip_cfa";
          break;
      }
      return li;
    }else if(page === "successStories"){
      switch (index) {
        case 1:
          li = "OTP_Skip_cfa1";
          break;
        case 2:
          li = "OTP_Skip_cfa2";
          break;
        case 3:
          li = "OTP_Skip_cfa3";
          break;
        case 4:
          li = "OTP_Skip_cfa4";
          break;
        case 5:
          li = "OTP_Skip_cfa5";
          break;
        case 6:
          li = "OTP_Skip_cfa6";
          break;
          
      }
      return li;
    }
    return li;
}

export function new_fl_ct_login_noBusiness(index, page = ""){
  let li = "";
  if(page === "landing"){
    switch (index) {
      case 1:
        li = "OTP_Skip_sn1_NBA";
        break;
      case 2:
        li = "OTP_Skip_sn2_NBA";
        break;
      case 3:
        li = "OTP_Skip_cfa_NBA";
        break;
    }
    return li;
  }else if(page === "successStories"){
    switch (index) {
      case 1:
        li = "OTP_Skip_cfa1_NBA";
        break;
      case 2:
        li = "OTP_Skip_cfa2_NBA";
        break;
      case 3:
        li = "OTP_Skip_cfa3_NBA";
        break;
      case 4:
        li = "OTP_Skip_cfa4_NBA";
        break;
      case 5:
        li = "OTP_Skip_cfa5_NBA";
        break;
      case 6:
        li = "OTP_Skip_cfa6_NBA";
        break;
        
    }
    return li;
  }
  return li;
}

export function new_fl_ct_login_hasBusiness(index, page = ""){
    let li = "";
    if(page === "landing"){
      switch (index) {
        case 1:
          li = "OTP_Skip_sn1_BA";
          break;
        case 2:
          li = "OTP_Skip_sn2_BA";
          break;
        case 3:
          li = "OTP_Skip_cfa_BA";
          break;
      }
      return li;
    }else if(page === "successStories"){
      switch (index) {
        case 1:
          li = "OTP_Skip_cfa1_BA";
          break;
        case 2:
          li = "OTP_Skip_cfa2_BA";
          break;
        case 3:
          li = "OTP_Skip_cfa3_BA";
          break;
        case 4:
          li = "OTP_Skip_cfa4_BA";
          break;
        case 5:
          li = "OTP_Skip_cfa5_BA";
          break;
        case 6:
          li = "OTP_Skip_cfa6_BA";
          break;
          
      }
      return li;
    }
    return li;
}

export function new_fl_ct_login_otpLoad_diffNumber(index, page = ""){
  let li = "";
  if(page === "landing"){
    switch (index) {
      case 1:
        li = "OTP_PL_sn1_LoggedIN_DN";
        break;
      case 2:
        li = "OTP_PL_sn2_LoggedIN_DN";
        break;
      case 3:
        li = "OTP_PL_cfa_LoggedIN_DN";
        break;
    }
    return li;
  }else if(page === "successStories"){
    switch (index) {
      case 1:
        li = "OTP_PL_cfa1_LoggedIN_DN";
        break;
      case 2:
        li = "OTP_PL_cfa2_LoggedIN_DN";
        break;
      case 3:
        li = "OTP_PL_cfa3_LoggedIN_DN";
        break;
      case 4:
        li = "OTP_PL_cfa4_LoggedIN_DN";
        break;
      case 5:
        li = "OTP_PL_cfa5_LoggedIN_DN";
        break;
      case 6:
        li = "OTP_PL_cfa6_LoggedIN_DN";
        break;
    }
    return li;
  }
  return li;
}
 
export function new_fl_ct_nonlogin_otpLoad(index, page = ""){
  let li = "";
  if(page === "landing"){
    switch (index) {
      case 1:
        li = "OTP_PL_sn1_NonLoggedIN";
        break;
      case 2:
        li = "OTP_PL_sn2_NonLoggedIN";
        break;
      case 3:
        li = "OTP_PL_cfa_NonLoggedIN";
        break;
    }
    return li;
  }else if(page === "successStories"){
    switch (index) {
      case 1:
        li = "OTP_PL_cfa1_NonLoggedIN";
        break;
      case 2:
        li = "OTP_PL_cfa2_NonLoggedIN";
        break;
      case 3:
        li = "OTP_PL_cfa3_NonLoggedIN";
        break;
      case 4:
        li = "OTP_PL_cfa4_NonLoggedIN";
        break;
      case 5:
        li = "OTP_PL_cfa5_NonLoggedIN";
        break;
      case 6:
        li = "OTP_PL_cfa6_NonLoggedIN";
        break;
        
    }
    return li;
  }
  return li;
}

export function new_fl_ct_always_otpLoad(index, page = ""){
  let li = "";
  if(page === "landing"){
    switch (index) {
      case 1:
        li = "OTP_PL_sn1";
        break;
      case 2:
        li = "OTP_PL_sn2";
        break;
     case 3:
        li = "OTP_PL_cfa";
        break;
    }
    return li;
  }else if(page === "successStories"){
    switch (index) {
      case 1:
        li = "OTP_PL_cfa1";
        break;
      case 2:
        li = "OTP_PL_cfa2";
        break;
      case 3:
        li = "OTP_PL_cfa3";
        break;
      case 4:
        li = "OTP_PL_cfa4";
        break;
      case 5:
        li = "OTP_PL_cfa5";
        break;
      case 6:
        li = "OTP_PL_cfa6";
        break;
        
    }
    return li;
  }
  return li;
}

export function new_fl_ct_otpSuccess(index, page = ""){
  let li = "";
  if(page === "landing"){
    switch (index) {
      case 1:
        li = "OTP_vfd_sn1";
        break;
      case 2:
        li = "OTP_vfd_sn2";
        break;
      case 3:
        li = "OTP_vfd_cfa";
        break;
      }
    return li;
  }else if(page === "successStories"){
    switch (index) {
      case 1:
        li = "OTP_vfd_cfa1";
        break;
      case 2:
        li = "OTP_vfd_cfa2";
        break;
      case 3:
        li = "OTP_vfd_cfa3";
        break;
      case 4:
        li = "OTP_vfd_cfa4";
        break;
      case 5:
        li = "OTP_vfd_cfa5";
        break;
      case 6:
        li = "OTP_vfd_cfa6";
        break;          
    }
    return li;
  }
  return li;
}

export function new_fl_ct_otpSuccess_nobusiness(index, page = ""){
  let li = "";
  if(page === "landing"){
    switch (index) {
      case 1:
        li = "OTP_vfd_sn1_NBA";
        break;
      case 2:
        li = "OTP_vfd_sn2_NBA";
        break;
      case 3:
        li = "OTP_vfd_cfa_NBA";
        break;
    }
    return li;
  }else if(page === "successStories"){
    switch (index) {
      case 1:
        li = "OTP_vfd_cfa1_NBA";
        break;
      case 2:
        li = "OTP_vfd_cfa2_NBA";
        break;
      case 3:
        li = "OTP_vfd_cfa3_NBA";
        break;
      case 4:
        li = "OTP_vfd_cfa4_NBA";
        break;
      case 5:
        li = "OTP_vfd_cfa5_NBA";
        break;
      case 6:
        li = "OTP_vfd_cfa6_NBA";
        break;
        
    }
    return li;
  }
  return li;
}

export function new_fl_ct_otpSuccess_hasbusiness(index, page = ""){
  let li = "";
  if(page === "landing"){
    switch (index) {
      case 1:
        li = "OTP_vfd_sn1_BA";
        break;
      case 2:
        li = "OTP_vfd_sn2_BA";
        break;
      case 3:
        li = "OTP_vfd_cfa_BA";
        break;
    }
    return li;
  }else if(page === "successStories"){
    switch (index) {
      case 1:
        li = "OTP_vfd_cfa1_BA";
        break;
      case 2:
        li = "OTP_vfd_cfa2_BA";
        break;
      case 3:
        li = "OTP_vfd_cfa3_BA";
        break;
      case 4:
        li = "OTP_vfd_cfa4_BA";
        break;
      case 5:
        li = "OTP_vfd_cfa5_BA";
        break;
      case 6:
        li = "OTP_vfd_cfa6_BA";
        break;
        
    }
    return li;
  }
  return li;
}



