import { useAuthContext } from "@/context/AuthContext";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProtectedRoutes = ({ children }) => {
  const { user } = useAuthContext();
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  return <>{user ? children : null}</>;
};

export default ProtectedRoutes;
