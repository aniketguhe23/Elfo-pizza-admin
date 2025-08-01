import BackendUrl from "@/app/api/BackendUrl"
import { io } from "socket.io-client"

const socket = io(BackendUrl, {
  transports: ["websocket"],
  autoConnect: false,
})

export default socket
