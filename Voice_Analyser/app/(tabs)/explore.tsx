import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, FlatList } from 'react-native';
import * as Device from 'expo-device';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCallback, useEffect, useState } from 'react';

export default function TabTwoScreen() {

  const [responses, setResponses] = useState([]);
  const fetchResponses = useCallback(async () => {
    const rootOrigin =
      Platform.OS === "android"
          ? Device.isDevice
              ? "192.168.29.47"
              :  "10.0.2.2"
          : Device.isDevice
          ? process.env.LOCAL_DEV_IP || "localhost"
          : "localhost";
      const serverUrl = `http://${rootOrigin}:4000`;
      console.log("serverUrl", serverUrl);
      const serverResponse = await fetch(`${serverUrl}/responses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await serverResponse.json();
      setResponses(data.responses);
    }, []);

    useEffect(() => {
      fetchResponses();
    }, [fetchResponses]);

  const RenderItem = ({ item }: { item: string }) => (
    <ThemedView style={styles.responseItem}>
      <ThemedText>{item}</ThemedText>
    </ThemedView>
  );


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <ThemedView>
      <FlatList
          data={responses}
          renderItem={({item}) => <RenderItem item={item}/>}
          keyExtractor={(item, index) => index.toString()}
        />        
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  responseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
