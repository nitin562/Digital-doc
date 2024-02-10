import {io} from "socket.io-client"
import {base} from "../../links"
const socket=io(base) //socket instance
export {socket}