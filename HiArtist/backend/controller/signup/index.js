export const signup_controller = async (req, res) => {
    try {
        const db = getDb();
        const { name, username, password, mobile_email, Profile_Photo, lastLogin } = req.body;
        let obj = {
            name,
            username,
            password,
            mobile_email,
            Profile_Photo: req.file ? domain + staticFiles + '/' + req.file.filename : 'NA',
            followers: [],
            followering: [],
            createdTime: new Date(),//5.30 add to get current india time
            lastLogin: new Date(),
            date: Math.floor(new Date().getTime() / 1000),
        };

        // res.send(JSON.stringify({ "msg": obj, "error": "submitted" }))
        let addData = await db.collection("user").insertOne(obj);
        res.send({
            status: true,
            message: "Record Inserted Successfully",
            data: addData,
        });
    } catch (error) {
        res.send({
            status: false,
            message: "Record Inserted Successfully",
            data: [],
        });
    }
}