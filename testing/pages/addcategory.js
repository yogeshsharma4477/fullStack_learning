import NewCategoryFlow from "@/components/NewCategoryFlow";
import axios from 'axios'

const AddCategory = (props) => {
  const { IP } = props
  return (
    <NewCategoryFlow
      IP={IP}
    />
  )
};

export async function getServerSideProps(ctx) {
  try {
    const cookieObject = ctx.req?.cookies || {};
    let IP = ctx.req.headers["true-client-ip"] || ctx.req.headers["x-forwarded-for"] || ctx.req.headers["x-real-ip"] || ctx.req.connection.remoteAddress;
    let userprofile = cookieObject["userProfile"];
    let isFlowCheck = cookieObject['isFlow'] || 'false'
    if (!userprofile) {
      ctx.res.writeHead(302, {
        Location: '/Free-Listing'
      });
      ctx.res.end();
    }
    // if (isFlowCheck == 'false') {
    //   ctx.res.writeHead(302, {
    //     Location: '/Free-Listing/bussinesslist'
    //   });
    //   ctx.res.end()
    // }

    let ip_url = `https://geolocation-db.com/json/`
    if (!IP) {
      IP = await axios.get(ip_url)
        .then(res => {
          return res?.data?.IPv4 || ""
        })
        .catch(err => {
          return ""
        })
    }

    if (userprofile) userprofile = JSON.parse(userprofile)
    let mobileNumber = userprofile?.mobile || ""
    return ({ props: { "mobileNumber": mobileNumber, "userprofile": userprofile, IP: IP ? IP : "" } })
  }
  catch (err) {
    console.error("error=>", err)
    return ({ props: { mobileNumber: '' } })
  }
}

export default AddCategory;

