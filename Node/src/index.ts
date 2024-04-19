import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import keycloak from "../configs/keycloak";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.set( 'trust proxy', true );
app.use(keycloak.middleware());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.get("/protected", keycloak.protect(),(req:Request, res:Response) => {
  res.send("entered the secure zone")
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
