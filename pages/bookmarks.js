import styles from "@/styles/Bookmark.module.scss";
import { inter, dancingScript } from "@/utils/fonts";
import Navbar from "@/components/Navbar";
import { signOut } from "firebase/auth";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";

const Bookmarks = () => {
  const { setUser, user } = useAuthContext();
  const router = useRouter();

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
    <main className={`${inter.className} ${styles.main}`}>
      <Navbar user={user} logoutHandler={logoutHandler} />
    </main>
  );
};

export default Bookmarks;
