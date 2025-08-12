/*import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { io } from 'socket.io-client'

const Chat = () => {

    const [responses, setResponses] = useState([])
    const [socket, setSocket] = useState(null)
    const [chat, setChat] = useState(true)
    const [nameUser, setNameUser] = useState("")
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const handleEnterChat = (data) => {
        setNameUser(data.name)
        setChat(false)
    }

    const handleMessageChat = (data) => {

        if (!socket) return console.error("No hay conexión con el servidor")

        const newMessage = {
            body: data.message,
            from: nameUser,
        }
        socket.emit("enviar-mensaje-front-back", newMessage)
        setResponses((prev) => [...prev, newMessage])
        reset({ message: "" })
    }

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket)
        newSocket.on("enviar-mensaje-front-back", (payload) => {
            setResponses((prev) => [...prev, payload])
        })
        return () => newSocket.disconnect()
    }, [])


    return (
        <>
            {
                chat
                    ? (
                        <div>
                            <form onSubmit={handleSubmit(handleEnterChat)} className="flex justify-center gap-5">
                                <input
                                    type="text"
                                    placeholder="Ingresa tu nombre de usuario"
                                    className="block w-1/2 rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
                                    {...register("name", { required: "El nombre de usuario es obligatorio" })}
                                />
                                <button className="py-2 w-1/2 block text-center bg-gray-500 text-slate-300 border rounded-xl hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white">Ingresar al chat</button>
                            </form>
                            {errors.name && <p className="text-red-800">{errors.name.message}</p>}
                        </div>
                    )
                    : (
                        <div className="flex flex-col justify-center h-full ">
                            <div className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">

                                {
                                    responses.map((response, index) => (
                                        <div key={index} className={`my-2 p-4 text-sm rounded-md text-white  ${response.from === nameUser ? 'bg-slate-700' : 'bg-black ml-auto'}`}>
                                            {response.from} - {response.body}
                                        </div>
                                    ))
                                }

                            </div>

                            <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                                <form onSubmit={handleSubmit(handleMessageChat)}>
                                    <div className="relative flex">
                                        <input type="text" placeholder="Escribe tu mensaje!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-2 bg-gray-200 rounded-md py-3"
                                            {...register("message", { required: "El mensaje es obligatorio" })} />

                                        <button className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-green-800 hover:bg-green-600 focus:outline-none"

                                        >
                                            <span className="font-bold">Enviar</span>
                                        </button>

                                    </div>
                                    {errors.message && <p className="text-red-800">{errors.message.message}</p>}
                                </form>
                            </div>
                        </div>

                    )
            }
        </>
    )
}

export default Chat*/
import { useEffect, useRef } from 'react';

export default function ChatBotpress() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // 1) script del webchat
    const s1 = document.createElement('script');
    s1.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    s1.defer = true;
    document.body.appendChild(s1);

    // 2) script de configuración (cópialo EXACTO desde "Share > Embed code")
    const s2 = document.createElement('script');
    // 👉 Reemplaza esta URL por la tuya (la del segundo <script> que te da Botpress)
    s2.src = 'https://files.bpcontent.cloud/2025/05/20/20250520201125-LAFMIU15.js';
    s2.defer = true;
    document.body.appendChild(s2);

    // 3) abre automáticamente cuando esté listo
    const onReady = () => window.botpress?.open?.();
    window.botpress?.on?.('webchat:ready', onReady);

    return () => {
      try { window.botpress?.reset?.(); } catch (e) {}
      window.botpress?.off?.('webchat:ready', onReady);
      document.body.removeChild(s1);
      document.body.removeChild(s2);
    };
  }, []);

  return (
    <div className="h-[75vh]">
      <div id="webchat-container" style={{ position:'relative', width:'100%', height:'100%' }} />
    </div>
  );
}