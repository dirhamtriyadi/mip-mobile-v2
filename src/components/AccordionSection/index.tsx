import { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
  } from 'react-native-reanimated';
import styles from "./styles";

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
}

const AccordionSection = ({title, children}: AccordionSectionProps) => {
  const heightValue = useSharedValue(0);

  const toggleExpand = useCallback(() => {
    const newHeight = heightValue.value === 0 ? 1 : 0;
    heightValue.value = withTiming(newHeight, {duration: 300});
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightValue.value ? 'auto' : 0,
    overflow: 'hidden',
    padding: heightValue.value ? 10 : 0,
  }));

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity onPress={toggleExpand} style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>{title}</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.accordionContent, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
};

export default AccordionSection;