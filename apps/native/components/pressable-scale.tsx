import React, { forwardRef, useRef } from "react";
import { Animated, Pressable, PressableProps, ViewStyle } from "react-native";

interface PressableScaleProps extends PressableProps {
  scaleTo?: number; // Target scale on pressIn (default 0.96)
  children?: React.ReactNode;
  className?: string; // For Nativewind
  style?: ViewStyle | ViewStyle[];
}

/**
 * Small helper that applies a smooth scale animation on press — adds a delightful micro-interaction.
 */
export const PressableScale = forwardRef<any, PressableScaleProps>(
  (
    {
      children,
      onPressIn,
      onPressOut,
      onPress,
      disabled = false,
      scaleTo = 0.96,
      style,
      className,
      ...rest
    },
    ref,
  ) => {
    const scale = useRef(new Animated.Value(1)).current;

    const animateTo = (to: number) => {
      Animated.spring(scale, {
        toValue: to,
        useNativeDriver: true,
        friction: 6,
        tension: 120,
      }).start();
    };

    return (
      <Pressable
        ref={ref}
        onPressIn={(e) => {
          animateTo(scaleTo);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          animateTo(1);
          onPressOut?.(e);
        }}
        onPress={onPress}
        disabled={disabled}
        {...rest}
      >
        <Animated.View
          style={[{ transform: [{ scale }] }, style] as any}
          className={className}
        >
          {children}
        </Animated.View>
      </Pressable>
    );
  },
);
