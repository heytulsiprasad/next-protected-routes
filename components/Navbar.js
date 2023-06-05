import { Avatar } from "@mantine/core";
import Link from "next/link";
import styles from "@/styles/Navbar.module.scss";
import emailToName from "email-to-name";
import { useRef, useState } from "react";
import { useClickOutside } from "@mantine/hooks";
import { useRouter } from "next/router";

const Navbar = ({ user, logoutHandler }) => {
  const [open, setOpen] = useState(false);
  const profileMenuRef = useClickOutside(() => setOpen(false));
  const router = useRouter();

  const isDashboard = router.pathname.includes("dashboard");

  return (
    <nav className={styles.navbar}>
      <div className={styles.navItems}>
        <Link
          style={{ color: isDashboard ? "#000" : "#9d9d9dbb" }}
          href="/dashboard"
        >
          Home
        </Link>
        <Link
          style={{ color: !isDashboard ? "#000" : "#9d9d9dbb" }}
          href="/bookmarks"
        >
          Bookmarks
        </Link>
      </div>
      <div className={styles.navProfile}>
        <Avatar color="cyan" radius="xl" onClick={() => setOpen((c) => !c)}>
          {emailToName.process(user.email).charAt(0)}
        </Avatar>
      </div>
      {open && (
        <div ref={profileMenuRef} className={styles.profileMenu}>
          <div className={styles.profileMenuItem} onClick={logoutHandler}>
            <p>Logout</p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
