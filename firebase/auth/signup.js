import firebaseApp from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { notifications } from "@mantine/notifications";

const auth = getAuth(firebaseApp);

// Create a signup function
export default async function signUp(email, password) {
  let result = null;

  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err.code);
    console.log(err.message);

    notifications.show({
      title: "Signup failed",
      message: err.message,
      color: "red",
    });
  }

  return { result };
}
