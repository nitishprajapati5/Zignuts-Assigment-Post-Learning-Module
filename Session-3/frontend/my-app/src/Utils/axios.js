import axios from "axios"
import { BASE_URL } from "./Constant";

const axiosInstance = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    withCredentials:true
})

export default axiosInstance;