import { inter, dancingScript } from "@/utils/fonts";
import styles from "@/styles/Dashboard.module.scss";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Avatar, Button, Loader } from "@mantine/core";
import { signOut, getAuth } from "firebase/auth";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import Navbar from "@/components/Navbar";
import WeatherCard from "@/components/WeatherCard";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

const Dashboard = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [favorites, setFavorites] = useState([]);

  const { setUser, user } = useAuthContext();
  const router = useRouter();
  const auth = getAuth();

  // console.log(user);

  // Fetch favorites when user is logged in
  useEffect(() => {
    // Fetch all favorites
    const fetchFavorites = async () => {
      const placesFavoritesRef = collection(
        db,
        "places",
        user.uid,
        "favorites"
      );

      const favResults = [];

      const querySnapshot = await getDocs(placesFavoritesRef);

      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        favResults.push(doc.id);
      });

      setFavorites(favResults);
    };

    fetchFavorites();
  }, [user]);

  // Update isFavorite when result is changed
  useEffect(() => {
    if (!result?.location) return;

    const id =
      `${result.location.name}-${result.location.region}-${result.location.country}`.trim();

    if (favorites.includes(id)) {
      setResult((prev) => ({ ...prev, isFavorite: true }));
    } else {
      setResult((prev) => ({ ...prev, isFavorite: false }));
    }
  }, [result.location]);

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
    } catch (error) {
      console.log(error.response.data);

      notifications.show({
        title: "Error",
        message: error.response.data.error.message,
        color: "red",
      });
    } finally {
      setValue("");
    }

    setLoading(false);
  };

  const addFavoritesHandler = async (id) => {
    const placesFavoritesRef = collection(db, "places", user.uid, "favorites");

    const payload = { ...result.location };

    console.log("Adding payload...", id, payload);

    // setDoc replaces the document if it already exists
    await setDoc(doc(placesFavoritesRef, id), payload);

    // Update result object in state
    setResult((prev) => ({ ...prev, isFavorite: true }));
  };

  const removeFavoritesHandler = async (id) => {
    const placesFavoritesRef = collection(db, "places", user.uid, "favorites");

    console.log("Removing payload...", id);
    await deleteDoc(doc(placesFavoritesRef, id));

    setResult((prev) => ({ ...prev, isFavorite: false }));
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
            <WeatherCard
              result={result}
              addFavoritesHandler={addFavoritesHandler}
              removeFavoritesHandler={removeFavoritesHandler}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
