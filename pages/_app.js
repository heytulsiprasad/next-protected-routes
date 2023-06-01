import "@/styles/globals.scss";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { AuthContextProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";
import ProtectedRoutes from "@/components/ProtectedRoutes";

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
