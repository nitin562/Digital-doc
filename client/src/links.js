const base="https://digitaldoc-2zu8.onrender.com"
const links={
    login:`${base}/api/auth/login`,
    signup:`${base}/api/auth/signup`,
    getData:`${base}/api/Data/data`,
    postData:`${base}/api/Data/Save`,
    getDataAndCollabs:`${base}/api/Data/DataAndcollabs`,
    search:`${base}/api/Data/search`


}
const origin="https://digitaldoc.vercel.app"
export {base,links,origin}