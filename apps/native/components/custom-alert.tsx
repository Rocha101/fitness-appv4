import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { useEffect, useMemo } from "react";
import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";

export type AlertVariant = "success" | "error";

interface CustomAlertProps {
  visible: boolean;
  variant: AlertVariant;
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function CustomAlert({
  visible,
  variant,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000,
}: CustomAlertProps) {
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      // Auto close
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, autoClose, autoCloseDelay]);

  const handleClose = () => {
    // Slide out animation
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const styles = useMemo(() => {
    switch (variant) {
      case "success":
        return {
          containerClassName:
            "w-full max-w-sm rounded-xl border-2 p-4 shadow-lg bg-green-50 border-green-200",
          iconColor: "#059669", // green-600
          titleClassName: "text-lg font-semibold mb-1 text-green-800",
          messageClassName: "text-base text-green-700",
          icon: CheckmarkCircle02Icon,
        };
      case "error":
        return {
          containerClassName:
            "w-full max-w-sm rounded-xl border-2 p-4 shadow-lg bg-red-50 border-red-200",
          iconColor: "#DC2626", // red-600
          titleClassName: "text-lg font-semibold mb-1 text-red-800",
          messageClassName: "text-base text-red-700",
          icon: AlertCircleIcon,
        };
      default:
        return {
          containerClassName:
            "w-full max-w-sm rounded-xl border-2 p-4 shadow-lg bg-gray-50 border-gray-200",
          iconColor: "#6B7280",
          titleClassName: "text-lg font-semibold mb-1 text-gray-800",
          messageClassName: "text-base text-gray-700",
          icon: AlertCircleIcon,
        };
    }
  }, [variant]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View className="flex-1 justify-start items-center pt-16 px-4">
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className={styles.containerClassName}
        >
          <View className="flex-row items-start">
            {/* Icon */}
            <View className="mr-3 mt-0.5">
              <HugeiconsIcon
                icon={styles.icon}
                size={24}
                color={styles.iconColor}
                strokeWidth={2}
              />
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text className={styles.titleClassName}>{title}</Text>
              <Text className={styles.messageClassName}>{message}</Text>
            </View>

            {/* Close button */}
            <TouchableOpacity
              onPress={handleClose}
              className="ml-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={20}
                color="#6B7280"
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// Hook for easier usage
export function useCustomAlert() {
  const [alert, setAlert] = React.useState<{
    visible: boolean;
    variant: AlertVariant;
    title: string;
    message: string;
  }>({
    visible: false,
    variant: "success",
    title: "",
    message: "",
  });

  const showAlert = React.useCallback(
    (variant: AlertVariant, title: string, message: string) => {
      setAlert({
        visible: true,
        variant,
        title,
        message,
      });
    },
    [],
  );

  const hideAlert = React.useCallback(() => {
    setAlert((prev) => ({ ...prev, visible: false }));
  }, []);

  const showSuccess = React.useCallback(
    (title: string, message: string) => {
      showAlert("success", title, message);
    },
    [showAlert],
  );

  const showError = React.useCallback(
    (title: string, message: string) => {
      showAlert("error", title, message);
    },
    [showAlert],
  );

  const AlertComponent = React.useCallback(
    () => (
      <CustomAlert
        visible={alert.visible}
        variant={alert.variant}
        title={alert.title}
        message={alert.message}
        onClose={hideAlert}
      />
    ),
    [alert, hideAlert],
  );

  return {
    showAlert,
    showSuccess,
    showError,
    hideAlert,
    AlertComponent,
  };
}
