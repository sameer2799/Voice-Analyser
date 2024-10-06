import { Request, Response } from "express";

export const responses: any[] = [];

const speechToText = async (req: Request, res: Response) => {
	const data = req.body;
    const audioUri = data?.audioUri;
    const audioConfig = data?.config;

    const url = "https://speech.googleapis.com/v1/speech:recognize";

    if (!audioUri) {
        res.status(422).send("Missing audioUri");
        return;
    }
    if (!audioConfig) {
        res.status(422).send("Missing audio config");
        return;
    }

    try {
        console.log("Sending request to Google Speech to Text API");
        const speechResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Goog-Api-Key": `${process.env.GOOGLE_SPEECH_TO_TEXT_API_KEY}`,
            },
            body: JSON.stringify({
                config: audioConfig,
                audio: {
                    content: audioUri,
                },
            }),
        }).then((response) =>  response.json())
        .catch((error) => {
            console.error("Some error occured while converting to text: ", error);
            res.status(500).send("Internal Server Error");
            return error;
        });
        console.log("Response from Google Speech to Text API: ", speechResponse);

        // responses.push(speechResponse);

        return res.status(200).send(speechResponse);
    } catch (error) {
        console.error("Some error occured while converting to text: ", error);
        res.status(500).send("Internal Server Error");
        return error;
    }


};

export default speechToText;
