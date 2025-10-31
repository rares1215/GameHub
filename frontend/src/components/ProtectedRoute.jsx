import { useEffect, useState } from "react";
import {Navigate} from "react-router-dom";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants"
import {jwtDecode} from "jwt-decode"
import api from "../api"


function ProtectedRoute({children}) {

    const [isAuth,setIsAuth] = useState(null);

    useEffect(() =>{
        validateAuth().catch(() => setIsAuth(false))
    },[])


    const refreshToken = async () =>{
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("api/token/refresh/", {refresh:refresh});
            if(res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuth(true)
            }else setIsAuth(false)
        }catch(err) {
            console.log(err);
            setIsAuth(false)
        }
    }


    const validateAuth = async () =>{
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(!token) {
            setIsAuth(false)
            return
        }
        const decoder = jwtDecode(token);
        const tokenExpDate = decoder.exp
        const currentTime = Date.now()/1000

        if(tokenExpDate < currentTime) await refreshToken();
        else setIsAuth(true)
    }


    if(isAuth===null) return <h1>Loading...</h1>

    return isAuth?children:<Navigate to="/login/" />
}


export default ProtectedRoute