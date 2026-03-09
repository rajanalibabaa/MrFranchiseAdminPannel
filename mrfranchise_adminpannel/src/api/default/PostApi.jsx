import axios from "axios";

export const PostApiCall = async (url, token, body = {}) => {
  try {
    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.error("API Call Error:", error.response?.data || error.message);
    throw error;
  }
};

export const PostApiWithData = async(url,body,token) => {

    try {
        const res = await axios.post(url,body,{
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : "",
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