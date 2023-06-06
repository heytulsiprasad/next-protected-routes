import styles from "@/styles/Bookmark.module.scss";
import { inter, dancingScript } from "@/utils/fonts";
import Navbar from "@/components/Navbar";
import { getAuth, signOut } from "firebase/auth";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import axios from "axios";
import { useState, useEffect } from "react";
import WeatherCard from "@/components/WeatherCard";
import { Loader } from "@mantine/core";

const Bookmarks = () => {
  const { setUser, user } = useAuthContext();
  const router = useRouter();
  const [favoriteResults, setFavoriteResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

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

  useEffect(() => {
    // Start loader
    setLoading(true);

    // Fetch all favorites places from firestore
    const fetchFavoritesWeather = async () => {
      const placesFavoritesRef = collection(
        db,
        "places",
        user.uid,
        "favorites"
      );
      const favoritePlacesIds = [];

      const querySnapshot = await getDocs(placesFavoritesRef);

      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        favoritePlacesIds.push(doc.id);
      });

      const favoriteWeatherResults = [];

      // Call weather api for each favorite place
      for (let i = 0; favoritePlacesIds.length > i; i++) {
        try {
          const location = favoritePlacesIds[i].split("-")[0];
          const response = await axios.get(
            `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${location}`
          );
          console.log(response.data);
          favoriteWeatherResults.push({ ...response.data, isFavorite: true });
        } catch (error) {
          console.error(error);
        }
      }

      console.log({ favoritePlacesIds, favoriteWeatherResults });
      setFavoriteResults(favoriteWeatherResults);

      // End loader
      setLoading(false);
    };

    fetchFavoritesWeather();
  }, [user.uid]);

  const removeFavoritesHandler = async (id) => {
    const placesFavoritesRef = collection(db, "places", user.uid, "favorites");

    console.log("Removing payload...", id);
    await deleteDoc(doc(placesFavoritesRef, id));

    const location = id.split("-")[0];

    // Remove from state
    setFavoriteResults((prev) => {
      return prev.filter((result) => {
        return result.location.name !== location;
      });
    });
  };

  return (
    <main className={`${inter.className} ${styles.main}`}>
      <Navbar user={user} logoutHandler={logoutHandler} />
      {loading ? (
        <Loader />
      ) : (
        favoriteResults.length > 0 &&
        favoriteResults.map((result) => (
          <WeatherCard
            key={result.location.name}
            result={result}
            removeFavoritesHandler={removeFavoritesHandler}
            addFavoritesHandler={() => {}}
          />
        ))
      )}
    </main>
  );
};

export default Bookmarks;
