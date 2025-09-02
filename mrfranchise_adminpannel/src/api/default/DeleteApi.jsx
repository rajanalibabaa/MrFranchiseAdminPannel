import axios from "axios";

export const DeleteApiCall = async (url) => {
    try {
        const res = await axios.delete(url, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return res;
    } catch (error) {
        // Optional: Log or rethrow the error with additional context
        throw new Error(`Error in API Call: ${error.message}`);
    }
};
