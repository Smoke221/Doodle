import { useState, useEffect, useRef } from "react";
import { initKeycloak } from "../keycloak";

const useAuth = (): boolean => {
    const isRunning = useRef(false);
    const [isLogin, setLogin] = useState(false);

    useEffect(() => {
        if (isRunning.current) return;
        isRunning.current = true;
        initKeycloak()
            .then((keycloak) => setLogin(!!keycloak.authenticated))
            .catch((error) => {
                console.error("Error initializing Keycloak:", error);
            });
    }, []);

    return isLogin;
};

export default useAuth;
