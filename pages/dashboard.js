import { inter, dancingScript } from "@/utils/fonts";
import styles from "@/styles/Dashboard.module.scss";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Avatar, Button } from "@mantine/core";
import { signOut, getAuth } from "firebase/auth";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import emailToName from "email-to-name";
import { useClickOutside } from "@mantine/hooks";

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const { setUser, user } = useAuthContext();
  const router = useRouter();
  const auth = getAuth();
  const profileMenuRef = useClickOutside(() => setOpen(false));

  console.log({
    user,
    name: emailToName.process(user.email),
  });

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
      <nav className={styles.navbar}>
        <div className={styles.navItems}>
          <Link style={{ color: "#000" }} href="/dashboard">
            Home
          </Link>
          <Link href="/bookmarks">Bookmarks</Link>
        </div>
        <div className={styles.navProfile}>
          <Avatar color="cyan" radius="xl" onClick={() => setOpen((c) => !c)}>
            {emailToName.process(user.email).charAt(0)}
          </Avatar>
        </div>
      </nav>
      {open && (
        <div ref={profileMenuRef} className={styles.profileMenu}>
          <div className={styles.profileMenuItem} onClick={logoutHandler}>
            <p>Logout</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
