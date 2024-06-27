import excuteQuery from '../../lib/db_dashboard_fetch';
const fetchDataTable = async (req, res)=>{
    try{
        const  {limit=20} = req.query;
        let query = `select * from tbl_bmodules_logs order by updatedon desc limit ${limit};`
        
        const response = await excuteQuery({
            query:query, 
            values: []
        });

        console.log("appppple", response)
    
        res.status(200).json(response);
    } catch (err) {
        console.log("erroro message", err)
        res.status(500).json({
            msg: err.message
        });
    }
}

export default fetchDataTable;
