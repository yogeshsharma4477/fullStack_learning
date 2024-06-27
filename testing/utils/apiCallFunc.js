import axios from "axios";

export const getApiCall = async (url, cb, config = {}) => {
  try {
    return await axios
      .get(url, config)
      .then((res) => {
        return cb({
          responce: {
            status: "success",
            data: res?.data || {},
            statuscode: res?.status || 200,
          },
        });
      })
      .catch((err) =>
        cb({
          responce: {
            status: "failed",
            data: err,
          },
        })
      );
  } catch (err) {
    cb({
      responce: {
        status: "failed",
        data: err,
      },
    });
  }
};

export const postApiCall = async (url, cb, config = {}) => {
  try {
    return await axios
      .post(url, config?.payload || {}, {
        withCredentials: config.withCredentials || false,
      })
      .then((res) => {
        return cb({
          responce: {
            status: "success",
            data: res?.data || {},
            statuscode: res?.status || 200,
          },
        });
      })
      .catch((err) =>
        cb({
          responce: {
            status: "failed",
            data: err,
          },
        })
      );
  } catch (err) {
    cb({
      responce: {
        status: "failed",
        data: err,
      },
    });
  }
};

// export const postApiCall = async((url, cb, config={})=>{
//     try{
//         axios.post(url, config)
//         .then((res)=>cb({responce: {
//             status: "success",
//             data: res
//         }}))
//         .catch((err)=>cb({responce: {
//             status: "failed",
//             data: err
//         }}))

//     } catch(err){
//         cb({responce: {
//             status: "failed",
//             data: err
//         }})
//     }
// })
