import { useForm } from "react-hook-form";
import storeProfile from "../../context/storeProfile";
import useFetch from "../../hooks/useFetch";
import { ToastContainer } from "react-toastify";

export default function FormAfiliado() {
  const { user } = storeProfile(); // trae _id del agente
  const { fetchDataBackend } = useFetch();
  const { register, handleSubmit, formState:{ errors }, reset } = useForm();

  const onSubmit = async (data) => {
    const storedUser = JSON.parse(localStorage.getItem("auth-token"));
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedUser.state.token}`,
    };
    const body = { ...data, agenteSAC: user?._id };  // 👈 clave que espera el backend
    const url = `${import.meta.env.VITE_BACKEND_URL}/afiliado/registro`;
    const ok = await fetchDataBackend(url, body, "POST", headers);
    if (ok) reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ToastContainer/>
      <div>
        <label className="mb-2 block text-sm font-semibold">Nombre</label>
        <input className="block w-full rounded-md border py-1 px-2 text-gray-500 mb-3"
               {...register("nombre",{required:"El nombre es obligatorio"})}/>
        {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold">Descripción</label>
        <textarea className="block w-full rounded-md border py-1 px-2 text-gray-500 mb-3"
                  {...register("descripcion",{required:"La descripción es obligatoria"})}/>
        {errors.descripcion && <p className="text-red-800">{errors.descripcion.message}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold">Prioridad</label>
        <select className="block w-full rounded-md border py-1 px-2 text-gray-500 mb-3"
                {...register("prioridad",{required:"Selecciona la prioridad"})}>
          <option value="">-- Seleccionar --</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        {errors.prioridad && <p className="text-red-800">{errors.prioridad.message}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold">Precio (USD)</label>
        <input type="number" step="any" className="block w-full rounded-md border py-1 px-2 text-gray-500 mb-3"
               {...register("precio",{required:"El precio es obligatorio", min:{value:0, message:"No puede ser negativo"}})}/>
        {errors.precio && <p className="text-red-800">{errors.precio.message}</p>}
      </div>
      <input type="submit" value="Registrar afiliado"
             className="bg-gray-800 w-full p-2 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-600 cursor-pointer transition-all"/>
    </form>
  );
}
