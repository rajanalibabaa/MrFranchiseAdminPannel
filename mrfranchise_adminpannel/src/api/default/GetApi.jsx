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


export const getApi = async (url) => {

    // console.log("postApi :",url)
  try {
    const res = await axios.get(url, {
      headers:  {
       'Content-Type': 'application/json',
      }
    });
    // console.log("resres :",res.data)
    return res;
  } catch (error) {
    console.error("POST API Error:", error);
    throw error;
  }
};
