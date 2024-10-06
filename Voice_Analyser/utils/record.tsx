import { Audio } from "expo-av";
import { Platform } from "react-native";
import React , { Dispatch, MutableRefObject, SetStateAction } from "react";

const record = async (
    audioRecordingRef: MutableRefObject<Audio.Recording>,
    setIsRecording: Dispatch<SetStateAction<boolean>>,
    alreadyReceivedPermission: boolean
) => {
    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const doneRecording = audioRecordingRef?.current?._isDoneRecording;
        if (doneRecording) audioRecordingRef.current = new Audio.Recording();

        let permissionResponse: Audio.PermissionResponse | null = null;

        if (Platform.OS !== "web")
        permissionResponse = await Audio.requestPermissionsAsync();

        if (alreadyReceivedPermission || permissionResponse?.status === "granted") {
            const recordingStatus =
            await audioRecordingRef.current.getStatusAsync();
            setIsRecording(true);
            if (!recordingStatus.canRecord) {
                audioRecordingRef.current = new Audio.Recording();

                const recordingOptions = {
                ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
                android: {
                    extension: ".amr",
                    outputFormat: Audio.AndroidOutputFormat.AMR_WB,
                    audioEncoder: Audio.AndroidAudioEncoder.AMR_WB,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                },
                ios: {
                    extension: ".wav",
                    audioQuality: Audio.IOSAudioQuality.HIGH,
                    sampleRate: 44100,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {
                    mimeType:
                    Platform.OS === "web" &&
                    window.navigator.userAgent.includes("Safari")
                        ? "audio/mp4"
                        : "audio/webm;codecs=opus",
                    bitsPerSecond: 128000,
                },
                };

            await audioRecordingRef?.current
            ?.prepareToRecordAsync(recordingOptions)
            .then(() => console.log("✅ Prepared recording instance"))
            .catch((e) => {
                console.error("Failed to prepare recording", e);
            });
            }
            console.log("🔴 Recording started");
        await audioRecordingRef?.current?.startAsync();
        console.log("🟢 Recording finished", audioRecordingRef);
        } else {
        console.error("Permission to record audio is required!");
        return;
    }
    } catch (error) {
        console.log("Failed to record!", error);
        return;
    }
}

export default record;