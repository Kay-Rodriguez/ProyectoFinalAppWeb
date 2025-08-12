import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import useFetch from '../hooks/useFetch';
import storeAuth from '../context/storeAuth';
import { GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const { fetchDataBackend } = useFetch();
    const { setToken, setRol } = storeAuth();

    const loginUser = async (data) => {
        try {
            const url = data.password.includes("VIDA")
                ? `${import.meta.env.VITE_BACKEND_URL}/agenteSAC/login`
                : `${import.meta.env.VITE_BACKEND_URL}/login`;
            const response = await fetchDataBackend(url, data, 'POST', null);
            if (!response) throw new Error('No hay respuesta del servidor');
            setToken(response?.token);
            setRol(response?.rol);
            toast.success('Inicio de sesión correcto');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            toast.error('Error al iniciar sesión');
        }
    };

    // handler para Google Login
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // credentialResponse.credential contiene el id_token (ID token JWT)
            const url = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
            const body = { token: credentialResponse?.credential };

            const response = await fetchDataBackend(url, body, 'POST', null);
            if (!response) throw new Error('Error en respuesta del backend Google');

            setToken(response?.token);
            setRol(response?.rol);
            toast.success('Bienvenida — inicio con Google correcto 🌸');
            navigate('/dashboard');
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('No se pudo iniciar sesión con Google');
        }
    };

    const handleGoogleError = () => {
        toast.error('Error en autenticación con Google');
    };

    return (
        
        <div className="flex flex-col sm:flex-row h-screen">
            <ToastContainer />
            {/* Imagen de fondo */}
            <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-[url('/public/images/vidalogin.jpg')] 
            bg-no-repeat bg-cover bg-center sm:block hidden">
            </div>

            {/* Contenedor de formulario */}
            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">
                <div className="md:w-4/5 sm:w-full">
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">Bienvenido(a) de nuevo</h1>
                    <small className="text-gray-400 block my-4 text-sm">Por favor ingresa tus datos</small>

                    <form onSubmit={handleSubmit(loginUser)}>

                        {/* Correo electrónico */}
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                            <input type="email" placeholder="Ingresa tu correo" className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500" 
                                {...register("email", { required: "El correo es obligatorio" })}
                            />
                                {errors.email && <p className="text-red-800">{errors.email.message}</p>}
                        </div>

                        {/* Contraseña */}
                        <div className="mb-3 relative">
                            <label className="mb-2 block text-sm font-semibold">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder=""
                                    className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500 pr-10"
                                    {...register("password", { required: "La contraseña es obligatoria" })}
                                />
                                    {errors.password && <p className="text-red-800">{errors.password.message}</p>}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 0 9.956 9.956 0 01-1.845 3.35M9.9 14.32a3 3 0 114.2-4.2m.5 3.5l3.8 3.8m-3.8-3.8L5.5 5.5" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.95 0a9.96 9.96 0 0119.9 0m-19.9 0a9.96 9.96 0 0119.9 0M3 3l18 18" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Botón de iniciar sesión */}
                        <div className="my-4">
                            <button className="py-2 w-full block text-center bg-blue-500 text-slate-300 border rounded-xl 
                            hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white">Iniciar sesión</button>
                        </div>
                    </form>

                    {/* Separador con opción de "O" */}
                    <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
                        <hr className="border-gray-400" />
                        <p className="text-center text-sm">O</p>
                        <hr className="border-gray-400" />
                    </div>

                    {/* Botón de inicio de sesión con Google */}
                    <div className="mt-5 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                        />
                    </div>


                    {/* Olvidaste tu contraseña */}
                    <div className="mt-5 text-xs border-b-2 py-4">
                        <Link to="/forgot/id" className="underline text-sm text-gray-400 hover:text-gray-900">¿Olvidaste tu contraseña?</Link>
                    </div>

                    {/* Enlaces para volver o registrarse */}
                    <div className="mt-3 text-sm flex justify-between items-center">
                        <Link to="/" className="underline text-sm text-gray-400 hover:text-gray-900">Regresar</Link>
                        <Link to="/register" className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Registrarse</Link>
                    </div>
                </div>
            </div>
        </div>
        );
};

export default Login;


    
