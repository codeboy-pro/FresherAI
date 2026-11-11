import api from "../utils/axios";

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/me");
   
    return response.data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error("Unable to load current user:", error);
    }
    return null;
  }
};


export const useCoins=async (data)=>{
   try{
    const  response=await api.post("/api/auth/user-coins",data);
    console.log(response.data);
    
    return response.data;
   } catch(error){
    console.log(error);
    
    return null;
   }
}