import React, { useRef, useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  Easing,
} from "react-native-reanimated";

interface ActivityProgressSvgProps {
  /** Value from 0 to 1 */
  progress: number;
  /** Width of the svg; height will follow original aspect-ratio (151 × 104) */
  width?: number;
  /** Stroke width for both track and progress */
  strokeWidth?: number;
  /** Track color */
  trackColor?: string;
  /** Progress color */
  progressColor?: string;
}

// helper to build semi-circle arc path
const buildSemiArcPath = (
  width: number,
  radius: number,
  strokeWidth: number,
) => {
  const cx = width / 2;
  const cy = radius + strokeWidth / 2; // center y

  const startX = cx - radius;
  const startY = cy;
  const endX = cx + radius;
  const endY = cy;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const ActivityProgressSvg: React.FC<ActivityProgressSvgProps> = ({
  progress,
  width = 200,
  strokeWidth = 12,
  trackColor = "#EDEDED",
  progressColor = "#333333",
}) => {
  // Keep progress in [0,1]
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const pathRef = useRef<Path>(null);
  const [pathLength, setPathLength] = useState(0);

  const animatedProgress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: pathLength * (1 - animatedProgress.value),
    } as any;
  }, [pathLength]);

  useEffect(() => {
    // Measure length on mount
    if (pathRef.current) {
      // @ts-ignore — getTotalLength available on SVG Path
      const length = pathRef.current.getTotalLength?.() || 0;
      if (length && length !== pathLength) setPathLength(length);
    }
  }, [width, strokeWidth]);

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });
  }, [clampedProgress]);

  const radius = (width - strokeWidth) / 2;

  const height = radius + strokeWidth; // only half circle plus stroke

  const ARC_D = buildSemiArcPath(width, radius, strokeWidth);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Track */}
      <Path
        d={ARC_D}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Progress */}
      <AnimatedPath
        ref={pathRef}
        d={ARC_D}
        fill="none"
        stroke={progressColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={pathLength ? [pathLength, pathLength] : undefined}
        animatedProps={animatedProps}
      />
    </Svg>
  );
};
