import "@/styles/globals.scss";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { AuthContextProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import Head from "next/head";

const noAuthRequired = ["/login", "/signup", "/"];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <Notifications />
        <Head>
          <title>WeatherNow</title>
          <meta
            name="description"
            content="Get latest weather news and updates from WeatherNow - an example created to show demo on using protected routes in Next.JS"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        {noAuthRequired.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoutes>
            <Component {...pageProps} />
          </ProtectedRoutes>
        )}
      </MantineProvider>
    </AuthContextProvider>
  );
}
