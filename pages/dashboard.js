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
import Navbar from "@/components/Navbar";
import WeatherCard from "@/components/WeatherCard";

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
        `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${location}`
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
      <Navbar user={user} logoutHandler={logoutHandler} />

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

          {result?.location && result?.current && (
            <WeatherCard result={result} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
