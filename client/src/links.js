const base="http://localhost:8000"
const links={
    login:`${base}/api/auth/login`,
    signup:`${base}/api/auth/signup`,
    getData:`${base}/api/Data/data`,
    postData:`${base}/api/Data/Save`,
    getDataAndCollabs:`${base}/api/Data/DataAndcollabs`,
    logout:`${base}/api/auth/logout`,
    search:`${base}/api/Data/search`


}
const origin="http://localhost:5173"
export {base,links,origin}