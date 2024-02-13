// const {links}= require("../../links")
import {origin} from "../../links"
const fetchup=async(url,method,userHeader={},Body=null)=>{
    const defaultHeaders={
        Origin:origin,
        "x-token":sessionStorage.getItem("token")
    }
    let options={
        method,
        headers:{...defaultHeaders,...userHeader},
    }
    if(Body){
        options={...options,body:Body}
    }
    const response=await fetch(url,options);
    const result=await response.json()
    return result;  
}
const colorDifference = (color1, color2) => {
    let rdiff = color1[0] - color2[0];
    let gdiff = color1[1] - color2[1];
    let bdiff = color1[2] - color2[2];
    return Math.sqrt(rdiff * rdiff + gdiff * gdiff + bdiff * bdiff);
  };
  const generateColors = () => {
    const backgroundColor = [50, 38, 84];
    do {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      let diff = colorDifference([r, g, b], backgroundColor);
      if (diff > 100) {
        return `rgb(${r},${g},${b})`;
      }
    } while (true);
  };
export {fetchup,generateColors}