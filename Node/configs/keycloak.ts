import Keycloak, { KeycloakConfig } from "keycloak-connect";
import dotenv from "dotenv";

dotenv.config();

const config: KeycloakConfig = {
    "realm": "Doodl",
    "auth-server-url": "http://localhost:3000/",
    "ssl-required": "external",
    "resource": "myDoodl",
    // "bearer-only": false,
    "confidential-port": 0
  }

export default new Keycloak({}, config);
