import axios from "axios"

export const PostApiCall = (url) => {

    const res = axios.post(url,{
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if(!res){
        throw new Error("Error in API Call")
    }
    return res;
}