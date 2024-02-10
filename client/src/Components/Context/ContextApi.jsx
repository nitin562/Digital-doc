import { useRef, useState } from "react";
import { createContext } from "react";

import { links } from "../../links";
import { fetchup } from "../UtlilityFunc/helper";
// import { SaveDoc, SaveWithDelta } from "../UtlilityFunc/helper";
const context = createContext();

const ContextProvider = (props) => {
  const [Data, setData] = useState([]);
  const [currentData, setCurrData] = useState(null);

  const [currentUsers, setcurrentUsers] = useState({});
  const onlineUserRef = useRef({});
  const getDelta = useRef(null);
  const getTitle = useRef("Untitled-Document");
  const [title, settitle] = useState("Untitled-Document");
  const colors = useRef({});
  const [prevContri, setprevContri] = useState({});
  const [colorState, setcolorState] = useState({});
  const SaveFunc = async () => {
    if (
      Object.keys(onlineUserRef.current).length > 1 &&
      !sessionStorage.getItem("SavePower")
    ) {
      alert("You are not admin of Shared Doc so you have no power to Save");
      return;
    }
    const url = links.postData;
    let header = { "Content-Type": "application/json" },
      body = {
        title: getTitle.current,
        delta: getDelta.current(),
        contributor: [],
      };
    let tokenArr = [];
    for (let email in onlineUserRef.current) {
      if (!prevContri[email]) {
        //undefined in prev contri means new user
        tokenArr.push(onlineUserRef.current[email].Token);
      }
    }
    if (tokenArr.length === 0 && sessionStorage.getItem("SavedDocID")) {
      //means it is already stored and no new users are there
      header = { ...header, "x-change": "false" };
      body = { ...body, id: sessionStorage.getItem("SavedDocID") };
    } else if (sessionStorage.getItem("SavedDocID") && tokenArr.length >= 1) {
      //means already stored but new user is present to save
      header = { ...header, "x-change": "true" };
      body = {
        ...body,
        id: sessionStorage.getItem("SavedDocID"),
        contributor: tokenArr,
      };
    } else {
      //means it is not stored so we need to create
      header = { ...header, "x-change": "false" };
      body = { ...body, contributor: tokenArr };
    }

    let stringbody = JSON.stringify(body);

    const result = await fetchup(url, "POST", header, stringbody);
    return result;
  };
 
  return (
    <context.Provider
      value={{
        Data,
        setData,
        currentData,
        setCurrData,
        getDelta,
        getTitle,
        currentUsers,
        setcurrentUsers,
        onlineUserRef,
        colors,
        colorState,
        setcolorState,
        SaveFunc,
        prevContri,
        setprevContri,
        title,
        settitle,
     
      }}
    >
      {props.children}
    </context.Provider>
  );
};
export { context, ContextProvider };
