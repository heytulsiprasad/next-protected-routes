import { inter, dancingScript } from "@/utils/fonts";
import styles from "@/styles/Dashboard.module.scss";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "@mantine/core";
import { signOut, getAuth } from "firebase/auth";
import { notifications } from "@mantine/notifications";

const Dashboard = () => {
  const { setUser, user } = useAuthContext();
  const router = useRouter();
  const auth = getAuth();

  console.log({ currentUser: user });

  const logoutHandler = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/login");

    // Show user a notification
    notifications.show({
      title: "Logout successful",
      message: "You have been logged out successfully",
      color: "green",
    });
  };

  return (
    <main className={`${dancingScript.className} ${styles.main}`}>
      <h1>Dashboard</h1>
      <Button color="red" onClick={logoutHandler}>
        Logout
      </Button>
    </main>
  );
};

export default Dashboard;
