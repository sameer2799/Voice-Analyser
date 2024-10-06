import { useRef, useState, useEffect } from "react";
import { Image, StyleSheet, Platform, ActivityIndicator, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import record from "@/utils/record";
import { transcribe } from "@/utils/transcribe";
import { Audio } from "expo-av";
import useWebFocus from "@/hooks/useWebFocus";


export default function HomeScreen() {
  const [transcribedSpeech, setTranscribedSpeech] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [isTanscribing, setIsTranscribing] = useState(false);
  const isWebFocused = useWebFocus();
  const audioRef = useRef(new Audio.Recording());
  const webAudioPermissionsRef = useRef<MediaStream | null>(null);

  const getMicAccess = async () => {
    if (isWebFocused) {
      const permissions = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      webAudioPermissionsRef.current = permissions;
    }
    else {
    if (webAudioPermissionsRef.current) {
    webAudioPermissionsRef.current
      .getTracks()
      .forEach((track) => track.stop());
    webAudioPermissionsRef.current = null;
    }
  }};

  

  const startRecording = async () => {
    await getMicAccess();
    setIsRecording(true);
    // Start recording
    await record(audioRef, setIsRecording, !!webAudioPermissionsRef.current);
  }

  const stopRecording = async () => {
    setIsRecording(false);
    setIsTranscribing(true);
    
    try {
      const transcribedText = await transcribe(audioRef);
      setTranscribedSpeech(transcribedText || ""); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsTranscribing(false);
    }
  }


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.prompt}>Press below button to record</ThemedText>
        <Pressable 
            style={{...styles.microphoneButton, opacity: isRecording || isTanscribing ? 0.5 : 1}} 
            onPressIn={startRecording}
            onPressOut={stopRecording}
            disabled={isRecording || isTanscribing}>
          {isRecording ? (
              <ActivityIndicator size="small" color="#fff"/>
            ) : (
              <FontAwesome name="microphone" size={30} color="black" />
            )}
          
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.transcribesContainer}>
        {isTanscribing ? (
          <ActivityIndicator size="small" color="#000"/>
        ) : (
          <ThemedText style={{...styles.transcribedText, color: transcribedSpeech ? "#000" : "rgb(150, 150, 150)"}}>
            {transcribedSpeech || "Your transcribed text"}
          </ThemedText>)
        }
        {/* <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText> */}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  prompt:{
    fontSize: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcribesContainer: {
    gap: 8,
    width: '100%',
    height: 300,
    padding: 20,
    marginBottom: 8,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'rgb(220, 220, 220)',
  },
  transcribedText: {
    fontSize: 20,
    padding: 5,
    color: 'black',
    flex: 1,
    flexWrap: 'wrap',
  },
  microphoneButton: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    marginTop : 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
