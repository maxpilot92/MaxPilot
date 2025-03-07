import axios from "axios";

export async function useStaff({ userRole }: { userRole: string }) {
  try {
    const response = await axios.get(
      `/api/user/user-details?userRole=${userRole}`
    );
    console.log(`${userRole}`, response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
}
