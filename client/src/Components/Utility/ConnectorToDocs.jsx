import React, { useContext, useEffect, useState } from "react";
import FormInput from "./FormInput";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../UtlilityFunc/socketInit";
import Loader from "./Loader";
import Cookies from "js-cookie";
import HoverModal from "./HoverModal";
import user from "../../Images/user.png";
import { context } from "../Context/ContextApi";
import { fetchup, generateColors } from "../UtlilityFunc/helper";
import { links } from "../../links";
export default function ConnectorToDocs() {
  const [id, setid] = useState(useParams().id);
  const [toogle, settoogle] = useState(false);
  const [connected, setconnected] = useState(false);
  const [conId, setConId] = useState(null);
  const [load, setLoad] = useState(false);
  const [copy, setcopy] = useState(false);
  const nav = useNavigate();
  const [toogleForHoverModal, setToogleForHoverModal] = useState({
    1: false,
    2: false,
    3: false,
  });
  const {
    currentUsers,
    setcurrentUsers,
    onlineUserRef,
    colors,
    setcolorState,
    prevContri,
    SaveFunc,
  } = useContext(context);

  const DoConnect = (e) => {
    e.preventDefault();
    setLoad(true);
    if (connected) {
      //disconnect
      socket.emit(
        "disconnectRoom",
        sessionStorage.getItem("id"), //url
        sessionStorage.getItem("email"),
        currentUsers
      );
      sessionStorage.setItem("connected",false)

      if (sessionStorage.getItem("SavePower")) {
        sessionStorage.removeItem("SavePower");
      }
    } else {
      socket.emit("connectRoom", id, sessionStorage.getItem("email"));
    }
  };
  const ConnectedNotify = (to, id, callback) => {
    //to means where you are connected
    // id means room id as url of page
    if (to === "self") {
      sessionStorage.setItem("SavePower", true);
      setconnected(true);
      // sessionStorage.setItem("admin",true)
      setConId("server");
      onlineUserRef.current[sessionStorage.getItem("email")].admin = true;
      sessionStorage.setItem("connected",true)
      if (!colors.current[sessionStorage.getItem("email")]) {
        colors.current[sessionStorage.getItem("email")] = generateColors();
      }
   
      setcolorState(colors.current);

      setcurrentUsers(onlineUserRef.current);
    } else if (to === "No") {
      setconnected(false);
      setConId("Not allowed");
      setTimeout(() => {
        setConId(null);
      }, 1000);
    } else {
      setconnected(true);
      setConId(id);

      callback({
        name: sessionStorage.getItem("name"),
        email: sessionStorage.getItem("email"),
        token: sessionStorage.getItem("token"),
      }); //sending my token as connection establish
    }
    setLoad(false);
  };
  const resetNow = () => {
 
    setconnected(false);
    setConId(false);
    setLoad(false);
    let dummy = {
      [sessionStorage.getItem("email")]: {
        ...onlineUserRef.current[sessionStorage.getItem("email")],
        admin: false,
      },
    };
    onlineUserRef.current = dummy;
    setcurrentUsers(onlineUserRef.current);
  };
  const NoConnection = () => {
    setLoad(false);
  };
  const copyTheId = () => {
    navigator.clipboard.writeText(id).then(
      () => {
        setcopy(true);
      },
      () => setcopy(false)
    );
    setTimeout(() => {
      setcopy(false);
    }, 2000);
  };
  const getuserConnected = async (connectedUser, email, alreadyColors) => {
    if (connectedUser[email]) {
      //joined
      alreadyColors[email] = generateColors();
      colors.current = { ...alreadyColors, ...colors.current };
      setcolorState(colors.current);
    } else {
      //delete
      if (sessionStorage.getItem("SavePower")) {
        await SaveFunc();
      }
      delete colors.current[email];
      setcolorState(colors.current);
    }
    onlineUserRef.current = connectedUser;
    setcurrentUsers(connectedUser);
  
  };
  useEffect(()=>{
    if(!sessionStorage.getItem("email")){
      nav("/")
    }
  },[])
  useEffect(() => {
    socket.on("NotAllowedToConnect", NoConnection);
    socket.on("Connected", ConnectedNotify);
    socket.on("disconnected", resetNow);
    socket.on("ConnectionTimeout", NoConnection);
    socket.on("getuserConnected", getuserConnected);

    return () => {
      socket.off("NotAllowedToConnect", NoConnection);
      socket.off("getuserConnected", getuserConnected);

      socket.off("Connected", ConnectedNotify);
      socket.off("disconnected", resetNow);
      socket.off("ConnectionTimeout", NoConnection);
    };
  }, [socket]);
  const logout = async () => {
    if (
      window.confirm(
        "Logout will not save your current doc. Do you want to logout?"
      ) === false
    ) {
      return;
    }
    const result = await fetchup(links.logout, "GET");

    if (result.success === 1) {
      if (
        sessionStorage.getItem("connected")==="true"
      ) {
        //connected then we have to disconnect
        socket.emit(
          "disconnectRoom",
          sessionStorage.getItem("id"), //url
          sessionStorage.getItem("email"),
          currentUsers
        );
      }
      sessionStorage.clear()

      nav("/");
    }
  };
  return (
    <div className="w-1/2 flex justify-end gap-x-4">
      {/* User information -name and email */}
      <div
        className="bg-slate-800 border-2 w-8 rounded-full cursor-pointer hover:drop-shadow-[0_0_0.5rem_#fff] transition-all flex justify-center items-center duration-200"
        onMouseOver={() =>
          setToogleForHoverModal((prev) => {
            return { ...prev, 3: true };
          })
        }
        onMouseOut={() =>
          setToogleForHoverModal((prev) => {
            return { ...prev, 3: false };
          })
        }
      >{sessionStorage.getItem("name")&&sessionStorage.getItem("name")[0]}</div>
      <div
        className={`absolute right-[5rem] mt-10 h-0 w-[25rem] bg-mainBg shadow-[0_0_0.5rem_#000] z-50 flex flex-col items-center ${
          toogleForHoverModal[3] ? "h-[19rem]" : "h-0"
        } transition-all duration-300 overflow-hidden`}
        onMouseOver={() =>
          setToogleForHoverModal((prev) => {
            return { ...prev, 3: true };
          })
        }
        onMouseOut={() =>
          setToogleForHoverModal((prev) => {
            return { ...prev, 3: false };
          })
        }
      >
        <img src={user} alt="logo" className="w-1/4 mt-8" />
        <p className="text-3xl mt-4 font-Quicksand tracking-wider">
          {sessionStorage.getItem("name")}
        </p>
        <button
          className="p-2 text-xl font-Abel mt-2 rounded-lg bg-red-700 hover:bg-red-400 transition-all duration-200 "
          onClick={logout}
        >
          Log Out
        </button>
      </div>
      {/* Displaying prevCollabs */}
      {Object.keys(prevContri).length > 0 && (
        <div
          className="px-2 py-1 rounded-md bg-indigo-500 cursor-pointer font-Maven_Pro text-white"
          onMouseOver={() =>
            setToogleForHoverModal((prev) => {
              return { ...prev, 1: true };
            })
          }
          onMouseOut={() =>
            setToogleForHoverModal((prev) => {
              return { ...prev, 1: false };
            })
          }
        >
          Previous Collaborator{" "}
          <span className="font-bold text-mainBg rounded-full px-1 bg-white text-center">
            {Object.keys(prevContri).length}
          </span>
        </div>
      )}
      {/* New comp for displaying prev */}
      {Object.keys(prevContri).length > 0 && (
        <HoverModal
          title="Prev Collabs"
          toggleNum={1}
          toggleChange={setToogleForHoverModal}
          toogle={toogleForHoverModal}
          Obj={prevContri}
          right={16}
        />
      )}
      {/* This is for information about current collaborators in doc */}
      <div
        className="px-2 py-1 rounded-md bg-indigo-500 cursor-pointer font-Maven_Pro text-white"
        onMouseOver={() =>
          setToogleForHoverModal((prev) => {
            return { ...prev, 2: true };
          })
        }
        onMouseOut={() =>
          setToogleForHoverModal((prev) => {
            return { ...prev, 2: false };
          })
        }
      >
        Collaborators{" "}
        <span className="font-bold text-mainBg rounded-full px-1 bg-white text-center">
          {Object.keys(currentUsers).length}
        </span>
      </div>
      {/* New comp for displaying collaborators */}
      <HoverModal
        title="Collaborator"
        toggleNum={2}
        toggleChange={setToogleForHoverModal}
        toogle={toogleForHoverModal}
        Obj={currentUsers}
        right={6.7}
      />

      {/* For connection request */}
      <button
        className="bg-slate-100 text-black px-2 border-b border-transparent font-Maven_Pro rounded-md hover:bg-lightBg hover:text-white hover:border-slate-300 "
        onMouseOver={() => settoogle(true)}
        onMouseOut={() => settoogle(false)}
      >
        Connect
      </button>
      <form
        className={`absolute right-4 mt-10 h-0 w-[25rem] bg-mainBg shadow-[0_0_0.5rem_#000] z-50 flex flex-col items-center justify-center ${
          toogle ? "h-[15rem]" : "h-0"
        } transition-all duration-300 overflow-hidden`}
        onMouseOver={() => settoogle(true)}
        onMouseOut={() => settoogle(false)}
        onSubmit={DoConnect}
      >
        <FormInput
          title="Room ID"
          type="text"
          write="Enter Room Id"
          width="w-3/4"
          size="text-md"
          color="text-slate-500"
          state={id}
          setstate={setid}
        />
        <button
          type="button"
          onClick={copyTheId}
          className="my-2 border border-white/20 font-Palanquin px-2 rounded-md text-pink-500 bg-slate-900 hover:bg-slate-800"
        >
          {copy ? "Copied" : "Copy"}
        </button>
        {id === useParams().id && (
          <p className="text-[0.6rem] text-sky-300 italic">
            Default is already set
          </p>
        )}
        {connected && (
          <p className="text-[0.6rem] text-sky-300 italic">
            Connected to {conId}
          </p>
        )}
        <button
          type="submit"
          className="my-2 border border-white/20 font-Palanquin px-2 rounded-md text-pink-500 bg-slate-900 hover:bg-slate-800"
        >
          {!connected ? "Send Request" : "Disconnect"}
        </button>
        {load && <Loader />}
        {!connected && conId && (
          <p className="text-[0.6rem] text-red-500 italic">{conId}</p>
        )}
      </form>
    </div>
  );
}
