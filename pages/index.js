import styles from "@/styles/Home.module.scss";
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { useState } from "react";
import { MdAlternateEmail, MdPassword } from "react-icons/md";
import { inter, dancingScript } from "@/utils/fonts";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const formSubmitHandler = (e) => {
    e.preventDefault();

    try {
      // Login using any service
    } catch (e) {
      console.error(e);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <main className={`${styles.main} ${inter.className}`}>
      <h1 className={dancingScript.className}>Welcome to WeatherNow 🌦️</h1>
      <div className={styles.formWrapper}>
        <form onSubmit={formSubmitHandler}>
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<MdAlternateEmail />}
            required
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<MdPassword />}
            required
          />
          <Button mt="lg" type="submit">
            Login
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Home;
