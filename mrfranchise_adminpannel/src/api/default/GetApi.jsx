import axios from "axios"

export const GetApiCall = (url) => {

    const res = axios.get(url,{
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if(!res){
        throw new Error("Error in API Call")
    }
    return res;
}