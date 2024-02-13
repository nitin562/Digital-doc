import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toolbarOptions } from "./toolbarOptions";
import Nav from "./Nav";
import Cookies from "js-cookie";
import { socket } from "./UtlilityFunc/socketInit";

import { useNavigate, useParams } from "react-router-dom";

import Modal1 from "./Utility/Modal1";
import Modal2 from "./Utility/Modal2";
import { links, origin } from "../links";
import { context } from "./Context/ContextApi";
import { fetchup, generateColors } from "./UtlilityFunc/helper";

export default function TextEditor() {
  const nav = useNavigate();

  const param = useParams();
  const okModal = useRef();
  const cancelModal = useRef();
  const [showCursors, setshowCursors] = useState(false);
  const mainBodyRef = useRef();
  const {
    currentData,
    setCurrData,
    getDelta,
    currentUsers,
    setcurrentUsers,
    onlineUserRef,
    colors,
    colorState,
    setcolorState,
    setprevContri,
    getTitle,
    title,
    settitle,
    SaveFunc,
  } = useContext(context);
  let clientBounds = () => {
    if (document.querySelectorAll(".ql-container")) {
      return document
        .querySelectorAll(".ql-container")[0]
        .getBoundingClientRect();
    }
  };
  let clientXY = useRef(null);

  const [showModal, setshowModal] = useState({ 1: false, 2: false });
  const [ModalMsg, setModalMsg] = useState("");

  const [q, setQuill] = useState();

  const ConReqCallback = (id, email, callback) => {
    const content = q.getContents();
    GetConnectReq(id, email, content, param.id);
    callback({
      status: "ok",
    });
  };
  const DoConnection = (Title, content, id) => {
    sessionStorage.setItem("id", id);
    sessionStorage.setItem("connected", true);

    nav(`/editor/${id}`, { state: { delta: content, title: Title } });
    q.setContents(content);
    getTitle.current = title;
    settitle(Title);
  };
  const onTextChange = (delta, oldDelta, source) => {
    if (source !== "user" || sessionStorage.getItem("id") === null) {
      return;
    }

    let pos = q.getBounds(q.getSelection().index);
    RecieveChange(null, pos, sessionStorage.getItem("email")); //update cursor also
    if (Object.keys(onlineUserRef.current).length <= 1) {
      return;
    }
    socket.emit(
      "Send-change",
      delta,
      sessionStorage.getItem("id"),
      pos,
      sessionStorage.getItem("email")
    );
  };
  const onSelectionChange = (range, oldRange, source) => {
    if (source !== "user" || sessionStorage.getItem("id") === null) {
      return;
    }
  
    if (!showCursors) {
      setshowCursors(true);
    }
    let pos = q.getBounds(q.getSelection().index);
    RecieveChange(null, pos, sessionStorage.getItem("email")); //set own cursor also
    if (Object.keys(onlineUserRef.current).length <= 1) {
      return;
    }
    socket.emit(
      "Send-change",
      null,
      sessionStorage.getItem("id"),
      pos,
      sessionStorage.getItem("email")
    );
  };
  const RecieveChange = (delta, pos, email) => {
    if (!q) {
      return;
    }
    if (!pos) {
      pos = q.getBounds(q.getSelection().index);
    }
    if (clientXY.current === null) {
      clientXY.current = clientBounds();
    }
    let { x, y } = clientXY.current;

    let newpos = {
      left: x + pos.left,
      top: y + pos.top,
    };

    onlineUserRef.current[email].cursor = newpos;
    setcurrentUsers((prevUsers) => {
      let updatedUsers = { ...prevUsers };
      updatedUsers[email] = {
        ...updatedUsers[email],
        cursor: { ...newpos },
      };
      return updatedUsers;
    });
    if (delta === null) {
      return;
    }
    q.updateContents(delta);
  };
  const GetConnectReq = (Socketid, email, content, urlId) => {
    setshowModal((prev) => {
      return { ...prev, 1: true };
    });
    setModalMsg(`Do you want to connect to ${email}`);
    okModal.current = () => {
      socket.emit(
        "AllowedToConnect",
        Socketid,
        getTitle.current,
        content,
        urlId,
        onlineUserRef.current,
        colors.current
      );

      setshowModal((prev) => {
        return { ...prev, 1: false };
      });
    };

    cancelModal.current = () => {
      socket.emit("NotAllowed", Socketid, urlId);
      setshowModal((prev) => {
        return { ...prev, 1: false };
      });
    };
  };
  const NotAllowedToConnect = (url) => {
    okModal.current = () => {
      setshowModal((prev) => {
        return { ...prev, 2: false };
      });
    };
    setModalMsg(`Admin has not allowed you to connect in ${url} room.`);
    setshowModal((prev) => {
      return { ...prev, 2: true };
    });
  };
  const DisconnectionFromAdminSide = (callback) => {
    okModal.current = () => {
      setshowModal((prev) => {
        return { ...prev, 2: false };
      });
    };
    setshowModal((prev) => {
      return { ...prev, 2: true };
    });
    setModalMsg("Admin has leaved the room, now you are new admin.");
    sessionStorage.setItem("SavePower", true);
    callback({ email: sessionStorage.getItem("email") });
  };
  const DisconnectionFromOtherSide = async (email, newUsers) => {
    setshowModal((prev) => {
      return { ...prev, 2: true };
    });
    setModalMsg(`${email} has leaved the room`);
    okModal.current = () => {
      setshowModal((prev) => {
        return { ...prev, 2: false };
      });
    };
    await SaveFunc();
    delete colors.current[email];
    setcolorState(colors.current);
    onlineUserRef.current = newUsers;
    setcurrentUsers(newUsers);
  };

  const NotifyConnectionTimeOut = () => {
    setModalMsg("Connection Timeout, Request can't reach the admin side ..");
    okModal.current = () => {
      setshowModal((prev) => {
        return { ...prev, 2: false };
      });
    };
    setshowModal((prev) => {
      return { ...prev, 2: true };
    });
  };
  useEffect(() => {
    if (!q || !socket) {
      return;
    }
    socket.on("GetConnectReq", ConReqCallback);
    socket.on("AllowingToConnect", DoConnection);
    socket.on("NotAllowedToConnect", NotAllowedToConnect);
    socket.on("YouAreAdminNow", DisconnectionFromAdminSide);
    q.on("text-change", onTextChange);
    q.on("selection-change", onSelectionChange);
    socket.on("recieve-change", RecieveChange);
    socket.on("otherLeaved", DisconnectionFromOtherSide);

    socket.on("ConnectionTimeout", NotifyConnectionTimeOut);

    return () => {
      socket.off("otherLeaved", DisconnectionFromOtherSide);
      socket.off("ConnectionTimeout", NotifyConnectionTimeOut);
      socket.off("NotAllowedToConnect", NotAllowedToConnect);

      socket.off("GetConnectReq", ConReqCallback);
      socket.off("AllowingToConnect", DoConnection);
      q.off("text-change", onTextChange);
      q.off("selection-change", onSelectionChange);

      socket.off("YouAreAdminNow", DisconnectionFromAdminSide);
      socket.off("recieve-change", RecieveChange);
    };
  }, [socket, q]);
  const editor = useCallback((wrap) => {
    if (wrap === null) {
      return;
    }

    const textEditor = new Quill(wrap, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    textEditor.root.style.background="#3b2e61"
    textEditor.root.style.fontSize="1rem"
    textEditor.root.style.color="#fff"
    
    setQuill(textEditor);

    //initilize your cursor

    //Creating and assigning SaveClick Func for navbar to context SaveClickFunc
    if (getDelta.current === null) {
      // if it is not then already save function is assigned
      getDelta.current = (contentType="delta") => {
        if(contentType==="html"){
          //return html 
          return textEditor.root.innerHTML
        }
        return textEditor.getContents();
      };
    }
  }, []);

  // resize function of window
  const onResize = () => {
    let { x, y } = clientBounds();
    // clientXY.current = { x, y };

    let currUserObj = onlineUserRef.current;
    Object.keys(currUserObj).forEach((e, i) => {
      let currPos = currUserObj[e].cursor;
      currPos.top = currPos.top - clientXY.current.y + y; //current-prev bounding gives current cursor postion relative to editor and then add new bounding
      currPos.left = currPos.left - clientXY.current.x + x;
      //assign
      currUserObj[e].cursor = currPos;
      setcurrentUsers((prevUsers) => {
        let updatedUsers = { ...prevUsers };
        updatedUsers[e] = {
          ...updatedUsers[e],
          cursor: { ...updatedUsers[e].cursor, ...currPos },
        };
        return updatedUsers;
      });
    });
    onlineUserRef.current = currUserObj;

    //assign new bounding to clientxy
    clientXY.current = { x, y };
  };
  const ReposCursor = () => {
    //scroll

    let { y } = clientBounds();
    let currUserObj = onlineUserRef.current;

    Object.keys(currUserObj).forEach((e, i) => {
      let currtop = currUserObj[e].cursor.top;

      currtop = currtop - clientXY.current.y + y; //current-prev bounding gives current cursor postion relative to editor and then add new bounding
      //assign

      currUserObj[e].cursor.top = currtop;
      setcurrentUsers((prevUsers) => {
        let updatedUsers = { ...prevUsers };
        updatedUsers[e] = {
          ...updatedUsers[e],
          cursor: { ...updatedUsers[e].cursor, top: currtop },
        };
        return updatedUsers;
      });
    });

    onlineUserRef.current = currUserObj;
    // setcurrentUsers(onlineUserRef.current)
    clientXY.current.y = y;
  };

  const gettingMessageFromOtherTab = (event) => {
    if (event.origin !== origin) {
      return;
    }

    if (event.data && event.data.dataId) {
      sessionStorage.setItem("SavedDocID", event.data.dataId);
      FetchSavedDocInfo();
    }
    
    
  };
  const FetchSavedDocInfo = async () => {
    if (!sessionStorage.getItem("SavedDocID") || currentData) {
      return;
    }
    const dataDoc = await fetchup(
      `${links.getDataAndCollabs}?dataId=${sessionStorage.getItem(
        "SavedDocID"
      )}`,
      "GET"
    );

    if (dataDoc.success === 1 ) {
      setCurrData({
        uid: dataDoc.data._id,
        title: dataDoc.data.title,
        delta: dataDoc.data.delta,
      });
      let collabArr = {};

      getTitle.current = dataDoc.data.title; //intilize the title ref
      dataDoc.contributor.map((e, i) => {
        collabArr[e.email] = { name: e.userName };
      });
      setprevContri(collabArr);
    }
    
  };
  const refreshAction = () => {
    onlineUserRef.current = {
      [sessionStorage.getItem("email")]: {
        name: sessionStorage.getItem("name"),
        admin: false,
        Token: sessionStorage.getItem("token"),
        cursor: {
          top: 0,
          left: 0,
        },
      },
    };
    colors.current = {
      [sessionStorage.getItem("email")]: generateColors(),
    };
    setcurrentUsers(onlineUserRef.current);
    setcolorState(colors.current);
  };
  const DisconnectWhenReload = (e) => {
    let email = sessionStorage.getItem("email");

    if (sessionStorage.getItem("connected") === "true") {
      socket.emit(
        "disconnectRoom",
        sessionStorage.getItem("id"), //url
        sessionStorage.getItem("email"),
        onlineUserRef.current
      );
      sessionStorage.removeItem("SavePower");
      sessionStorage.setItem("connected", false);
    }

    // socket.emit("dummy",onlineUserRef.current,currentUsers)
  };

  useEffect(() => {
    //when currentData change internally means we need to display
    if (q && currentData) {
      q.setContents(currentData.delta);
    }
  }, [currentData]);
  useEffect(() => {
    if (param.id === sessionStorage.getItem("id")) {
      return;
    }
    if (
      sessionStorage.getItem("connected") === "true" &&
      window.confirm("It will disconnect and may not save doc") === false
    ) {
      return;
    }
    DisconnectWhenReload();
    sessionStorage.setItem("id", param.id);
  }, [param.id]);
  useEffect(() => {
    RecieveChange(null, null, sessionStorage.getItem("email"));
    // window.addEventListener("load",onload)
    if (!sessionStorage.getItem("email")) {
      //if not then go to login again
      //may be token is yet present because there can be some anonyomous actions taken by user that leads to not requesting logout from server but due useEffects in mounting of login and signIn page, if you not login by button then sessionstorge will not have name and email that indicates to go back
      nav("/");
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("message", gettingMessageFromOtherTab);
    // window.addEventListener("beforeunload",onReload)
    FetchSavedDocInfo();
    refreshAction();
    mainBodyRef.current.addEventListener("scroll", ReposCursor);
    return () => {
      // window.removeEventListener("load",onload)

      // window.removeEventListener("beforeunload",onReload)
      // window.addEventListener("beforeunload", DisconnectWhenReload);
      // DisconnectWhenReload()

      window.removeEventListener("resize", onResize);
      window.removeEventListener("message", gettingMessageFromOtherTab);
      if (mainBodyRef.current) {
        mainBodyRef.current.removeEventListener("scroll", ReposCursor);
      }
    };
  }, []);
  const cursorElements = useMemo(() => {
    if (!showCursors) {
      return;
    }
    return Object.keys(currentUsers).map((userId) => (
      <div
        key={userId}
        className={`animateCursor w-[1px] z-30 h-6 absolute`}
        style={{
          top: `${currentUsers[userId]?.cursor.top}px`,
          left: `${currentUsers[userId]?.cursor.left}px`,
          backgroundColor: colorState[userId],
        }}
        title={userId}
      ></div>
    ));
  }, [currentUsers, showCursors]);
  return (
    <div
      className="scrollbar w-screen h-screen  p-3 flex flex-col items-center bg-mainBg text-white "
      ref={mainBodyRef}
    >
      {showModal[1] && (
        <Modal1 Ques={ModalMsg} ok={okModal} cancel={cancelModal} />
      )}
      {showModal[2] && <Modal2 statement={ModalMsg} ok={okModal} />}

      <Nav />
      <div ref={editor} className="caret-transparent"></div>
      {cursorElements}
      {/* <Message/> */}
    </div>
  );
}
