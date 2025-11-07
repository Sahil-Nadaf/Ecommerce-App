import { doc, getDoc } from "firebase/firestore";
import { db } from "../firestore/firebaseConfig";

export const fetchProductById = async (pid) => {
  try {
    const docRef = doc(db, "products", pid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { pid, ...docSnap.data() };
    } else {
      console.log("No product found for pid:", pid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
