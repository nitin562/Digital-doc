const base="https://digitaldoc-2zu8.onrender.com"
const links={
    login:`${base}/api/auth/login`,
    signup:`${base}/api/auth/signup`,
    getData:`${base}/api/Data/data`,
    postData:`${base}/api/Data/Save`,
    getDataAndCollabs:`${base}/api/Data/DataAndcollabs`,
    logout:`${base}/api/auth/logout`,
    search:`${base}/api/Data/search`


}
const origin="https://digital-doc.vercel.app/"
export {base,links,origin}