import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  PanResponder,
} from "react-native";

const { width, height } = Dimensions.get("window");

const statuses = [
  { id: 1, user: "Sahan", time: "Just now", image: "https://picsum.photos/600/900" },
  { id: 2, user: "Lahiru", time: "2m ago", image: "https://picsum.photos/601/900" },
  { id: 3, user: "Nipun", time: "5m ago", image: "https://picsum.photos/602/900" },
];

export default function StatusScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(0)).current; // Header movement
  const isPaused = useRef(false);

  useEffect(() => {
    startProgress();
  }, [currentIndex]);

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !isPaused.current) nextStatus();
    });
  };

  const nextStatus = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const prevStatus = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 20,
      onPanResponderMove: (_, gestureState) => {
        // move header with gesture
        headerY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          // swipe down enough -> exit
          navigation.goBack();
        } else {
          // else reset header position
          Animated.spring(headerY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Status Image */}
      <Image
        source={{ uri: statuses[currentIndex].image }}
        style={styles.image}
      />

      {/* Top Bar + User Info */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerY }] }, // move header on swipe
        ]}
      >
        <View style={styles.progressContainer}>
          {statuses.map((_, index) => {
            const barWidth =
              index === currentIndex
                ? progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width / statuses.length - 4],
                  })
                : width / statuses.length - 4;
            return (
              <View key={index} style={styles.progressBackground}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { width: index === currentIndex ? barWidth : width / statuses.length - 4 },
                  ]}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.userInfo}>
          <Image
            source={{ uri: "https://ui-avatars.com/api/?name=" + statuses[currentIndex].user }}
            style={styles.profilePic}
          />
          <View>
            <Text style={styles.userName}>{statuses[currentIndex].user}</Text>
            <Text style={styles.time}>{statuses[currentIndex].time}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.left} onPress={prevStatus} />
        <TouchableOpacity style={styles.right} onPress={nextStatus} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d2b" },
  image: { width, height, resizeMode: "cover", position: "absolute", top: 0, left: 0 },
  header: { position: "absolute", top: 0, width: "100%" },
  progressContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    width: "95%",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  progressBackground: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 2,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 3, backgroundColor: "#9d8cff" },
  userInfo: { flexDirection: "row", alignItems: "center", top: 60, left: 12, position: "absolute" },
  profilePic: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: "#9d8cff", marginRight: 12 },
  userName: { color: "white", fontWeight: "bold", fontSize: 16 },
  time: { color: "#ccc", fontSize: 12 },
  controls: { position: "absolute", flexDirection: "row", width: "100%", height: "100%" },
  left: { flex: 1 },
  right: { flex: 1 },
});
