import Keycloak, { KeycloakInstance } from "keycloak-js";

export const initKeycloak = (): Promise<KeycloakInstance> => {
    return new Promise((resolve, reject) => {
        const keycloak = new Keycloak({
            url: import.meta.env.VITE_KEYCLOAK_URL,
            realm: import.meta.env.VITE_KEYCLOAK_REALM,
            clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
        });


        keycloak.init({ onLoad: "login-required" })
            .then((authenticated) => {
                resolve(keycloak);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
