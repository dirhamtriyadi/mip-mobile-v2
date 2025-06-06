import React, {memo, useCallback, useState} from 'react';
import {
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
}

const AccordionSection = memo(({title, children}: AccordionSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    // Gunakan LayoutAnimation untuk animasi yang lebih ringan
    if (Platform.OS === 'android') {
      LayoutAnimation.configureNext({
        duration: 200, // Durasi lebih pendek
        create: {type: 'easeInEaseOut', property: 'opacity'},
        update: {type: 'easeInEaseOut'},
      });
    }

    setIsExpanded(prev => !prev);
  }, []);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={styles.accordionHeader}
        activeOpacity={0.7}>
        <Text style={styles.accordionTitle}>{title}</Text>
      </TouchableOpacity>

      {/* Conditional rendering tanpa animasi kompleks */}
      {isExpanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
});

AccordionSection.displayName = 'AccordionSection';

export default AccordionSection;
