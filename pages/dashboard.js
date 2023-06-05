import { inter, dancingScript } from "@/utils/fonts";
import styles from "@/styles/Dashboard.module.scss";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Avatar, Button, Loader } from "@mantine/core";
import { signOut, getAuth } from "firebase/auth";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import emailToName from "email-to-name";
import { useClickOutside } from "@mantine/hooks";
import axios from "axios";
import { AiFillStar, AiOutlineStar, AiFillCloud } from "react-icons/ai";
import { FiWind } from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";

const Dashboard = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState();

  const { setUser, user } = useAuthContext();
  const router = useRouter();
  const auth = getAuth();
  const profileMenuRef = useClickOutside(() => setOpen(false));

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

  const getWeather = async (e) => {
    e.preventDefault();

    const API_KEY = process.env.NEXT_WEATHER_API_KEY;
    const location = value;

    if (!value) {
      notifications.show({
        title: "Error",
        message: "Please enter a location",
        color: "red",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`
      );

      console.log(response.data);
      setResult(response.data);
      setValue("");
    } catch (error) {
      console.log(error.response.data);

      notifications.show({
        title: "Error",
        message: error.response.data.error.message,
        color: "red",
      });
    }

    setLoading(false);
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

      {/* Get weather here */}
      <div className={styles.weatherApp}>
        {/* Insert location name */}
        <form className={styles.inputLocation} onSubmit={getWeather}>
          <h4>Location</h4>
          <div className={styles.inputBox}>
            <input
              type="text"
              name="location"
              placeholder="Enter your location"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button
              variant="outline"
              type="submit"
              color="pink"
              onSubmit={getWeather}
            >
              Submit
            </Button>
          </div>
        </form>

        {/* Results */}
        <div className={styles.results}>
          {loading && <Loader />}

          {result.location && result.current && (
            <div className={styles.result}>
              <div className={styles.resultHeader}>
                <div>
                  <h1 className={dancingScript.className}>
                    {result.location.name}, {result.location.region}
                  </h1>
                </div>
                <div className={styles.favIcon}>
                  <AiOutlineStar
                    size="24px"
                    color="#FFDF00"
                    style={{ marginTop: "5px" }}
                  />
                  {/* <AiFillStar
                    size="24px"
                    color="#FFDF00"
                    style={{ marginTop: "5px" }}
                  /> */}
                </div>
              </div>
              <div className={styles.resultDetails}>
                <div className={styles.resultDetailsLeft}>
                  <img
                    src={result.current.condition.icon}
                    alt="Weather status"
                  />
                </div>
                <div className={styles.resultDetailsMiddle}>
                  <h2>{result.current.temp_c}&deg;C</h2>
                  <p>{result.current.condition.text}</p>
                </div>
                <div className={styles.resultDetailsRight}>
                  <div className={styles.resultDetailsInfo}>
                    <div>
                      <AiFillCloud />
                    </div>
                    <div>{result.current.cloud}%</div>
                  </div>
                  <div className={styles.resultDetailsInfo}>
                    <div>
                      <FiWind />
                    </div>
                    <div>{result.current.wind_kph}kph</div>
                  </div>
                  <div className={styles.resultDetailsInfo}>
                    <div>
                      <WiHumidity />
                    </div>
                    <div>{result.current.humidity}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
