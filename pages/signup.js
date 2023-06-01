import styles from "@/styles/Home.module.scss";
import { TextInput, PasswordInput, Button, Text } from "@mantine/core";
import { useState } from "react";
import { MdAlternateEmail, MdPassword } from "react-icons/md";
import { inter, dancingScript } from "@/utils/fonts";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/router";
import Link from "next/link";
import { notifications } from "@mantine/notifications";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    // Login using any service
    const { result } = await signUp(email, password);

    console.log({ result });
    if (result) {
      console.log(result);

      // Show success notification
      notifications.show({
        title: "Login successful",
        message: "You have been logged in successfully",
        color: "green",
      });

      return router.push("/dashboard");
    }

    // Clear the form
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
            Register
          </Button>
          <h6>
            <Link href="/login">Already have an account? Login</Link>
          </h6>
        </form>
      </div>
    </main>
  );
};

export default SignupPage;
