import axios from "axios"

export const PostApiCall = (url,token) => {

    const res = axios.post(url,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : "",
        }
    })

    if(!res){
        throw new Error("Error in API Call")
    }
    return res;
}
export const PostApiWithData = (url,body) => {

    try {
        const res = axios.post(url,body,{
            headers: {
                'Content-Type': 'application/json',
            }
        })
    
        if(!res){
            throw new Error("Error in API Call")
        }
        return res;
    } catch (error) {
        throw new Error("Error in API Call: " + error.message);
    }
}