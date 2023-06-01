import { inter, dancingScript } from "@/utils/fonts";
import styles from "@/styles/Home.module.scss";
import Link from "next/link";
import { Button, Group } from "@mantine/core";

const Home = () => {
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <h1 className={dancingScript.className}>Welcome to WeatherNow 🌦️</h1>
      <Group>
        <Button>
          <Link href="/login">Login</Link>
        </Button>
        <Button>
          <Link href="/signup">Signup</Link>
        </Button>
      </Group>
    </main>
  );
};

export default Home;
