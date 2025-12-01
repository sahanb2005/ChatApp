import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, View } from "react-native";

const { width, height } = Dimensions.get("window");

const generateStars = (count: number) =>
  Array.from({ length: count }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    opacity: new Animated.Value(Math.random()),
  }));

export default function GalaxyBackground({ children }: { children: React.ReactNode }) {
  const stars = useRef(generateStars(80)).current;

  useEffect(() => {
    stars.forEach((star) => {
      const loop = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: 1,
            duration: 2000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0.3,
            duration: 2000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => loop());
      };
      loop();
    });
  }, [stars]);

  return (
    <View className="flex-1 bg-black">
      {/* Stars */}
      {stars.map((star, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            top: star.y,
            left: star.x,
            width: star.size,
            height: star.size,
            borderRadius: star.size / 2,
            backgroundColor: "white",
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Content */}
      <View className="flex-1">{children}</View>
    </View>
  );
}
