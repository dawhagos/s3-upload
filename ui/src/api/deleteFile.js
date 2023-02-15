import axios from "axios";
import { API_URL } from "./config";

export async function deleteFile(fileName) {
  axios
    .delete(`${API_URL}/files/${fileName}`, {
      withCredentials: true,
    })
    .then((response) => {
      console.log("Resource deleted successfully");
    })
    .catch((error) => {
      console.log("Error deleting resource:", error);
    });
}
