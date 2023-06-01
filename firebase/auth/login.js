import firebaseApp from "../config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { notifications } from "@mantine/notifications";

const auth = getAuth(firebaseApp);

// Create a login function
export default async function login(email, password) {
  let result = null;

  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err.code);
    console.log(err.message);

    notifications.show({
      title: "Login failed",
      message: err.message,
      color: "red",
    });
  }

  return { result };
}
