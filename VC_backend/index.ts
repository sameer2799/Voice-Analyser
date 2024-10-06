import express, { Request, response, Response } from "express";

import speechToText, { responses } from "./utils/speechToTextUtil";
import "dotenv/config";
import cors from "cors";


const port = process.env.PORT || 4000;

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.get("/", (req, res) =>{
	res.send("The API is up and running!");
});

app.post("/transcribe", (req: Request, res: Response) => {
	console.log("Request received. Calling speechToText function which sends request to Google Speech to Text API");
	speechToText(req, res);	
});

app.get("/responses", (req: Request, res: Response) => {
	res.send(responses);
});

app.listen(port, ()=>{
	console.log(`Server is up and running on port: ${port}`);
});
