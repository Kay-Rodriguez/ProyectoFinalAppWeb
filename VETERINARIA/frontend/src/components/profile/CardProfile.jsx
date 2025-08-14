import storeProfile from "../../context/storeProfile"

// src/components/profile/CardProfile.jsx
import useFetch from "../../hooks/useFetch"


export default function CardProfile() {
  const { fetchDataBackend } = useFetch()
  const { user, setUser } = storeProfile()

  // ✅ JS puro, sin tipos TS
  const onChangeAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const form = new FormData()
    form.append("imagen", file)                 // <-- nombre del campo en backend
    // si tu backend espera "avatarContrato", usa ese nombre:
    // form.append("avatarContrato", file)

    const stored = JSON.parse(localStorage.getItem("auth-token"))
    const headers = {
      // ❗ NO pongas Content-Type manual; el navegador setea boundary del multipart:
      Authorization: `Bearer ${stored?.state?.token || ""}`,
    }

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/administrador/${user._id}/avatar`
      const updated = await fetchDataBackend(url, form, "PUT", headers)
      if (updated?.avatarUrl) {
        // actualiza UI (asumiendo que guardas el url en user.avatar)
        setUser({ ...user, avatar: updated.avatarUrl })
      }
    } catch (err) {
      console.error(err)
      alert("No se pudo actualizar el avatar")
    }
  }

  return (
    <div className="bg-white border border-slate-200 p-4 shadow-xl rounded-lg">
      <div className="relative">
        <img
          src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"}
          alt="avatar"
          className="m-auto rounded-full border-2 border-gray-300"
          width={120}
          height={120}
        />
        <label className="absolute bottom-0 right-0 bg-blue-400 text-white rounded-full p-2 cursor-pointer">
          📷
          <input type="file" accept="image/*" className="hidden" onChange={onChangeAvatar} />
        </label>
      </div>


            <div className="self-start">
                <b>Nombre:</b><p className="inline-block ml-3">{user?.nombre}</p>
            </div>
            <div className="self-start">
                <b>Apellido:</b><p className="inline-block ml-3">{user?.apellido}</p>
            </div >
            <div className="self-start">
                <b>Dirección:</b><p className="inline-block ml-3">{user?.direccion}</p>
            </div>
            <div className="self-start">
                <b>Teléfono:</b><p className="inline-block ml-3">{user?.celular}</p>
            </div>
            <div className="self-start">
                <b>Correo:</b><p className="inline-block ml-3">{user?.email}</p>
            </div>
        </div>
    )
}