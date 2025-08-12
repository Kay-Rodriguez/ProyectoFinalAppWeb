/*import axios from "axios";
import { toast } from "react-toastify";

function useFetch() {
    const fetchDataBackend = async (url, data = null, method = "GET",headers = {}) => {
        const loadingToast = toast.loading("Procesando solicitud...");
        try {
            const options = {
            method,
            url,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            data,
            }
            const response = await axios(options)
            toast.dismiss(loadingToast); 
            toast.success(response?.data?.msg)
            return response?.data
        } catch (error) {
            toast.dismiss(loadingToast); 
            console.error(error)
            toast.error(error.response?.data?.msg)
        }
    }

    return { fetchDataBackend }
} export default useFetch;*/
// src/hooks/useFetch.js
import axios from "axios";
import { toast } from "react-toastify";

function useFetch() {
  const fetchDataBackend = async (url, data = null, method = "GET", extraHeaders = {}) => {
    const loadingToast = toast.loading("Procesando solicitud...");

    try {

        extraHeaders = extraHeaders || {};

      const isForm = (typeof FormData !== "undefined") && (data instanceof FormData);

      // Solo ponemos application/json si NO es FormData y el caller no lo puso ya
      const headers = {
        ...(!isForm && !extraHeaders["Content-Type"] ? { "Content-Type": "application/json" } : {}),
        ...extraHeaders,
      };

      const options = { method, url, headers };
      if (data !== null) options.data = data; // axios serializa JSON y respeta FormData

      const { data: resp } = await axios(options);
      toast.dismiss(loadingToast);
      if (resp?.msg) toast.success(resp.msg);
      return resp;
    } catch (error) {
      toast.dismiss(loadingToast);
      const msg = error?.response?.data?.msg || error?.message || "Error en la solicitud";
      toast.error(msg);
      return null;
    }
  };

  return { fetchDataBackend };
}

export default useFetch;
