import React, { useState, useEffect } from 'react';
import {
  View,
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

interface SwiperProps {
  children: React.ReactNode[];
  onSwipeLeft?: (index: number) => void;
  onSwipeRight?: (index: number) => void;
  cardStyle?: object;
  containerStyle?: object;
  onReset?: () => React.ReactNode[];
}

const { width, height } = Dimensions.get('window');

const Swiper: React.FC<SwiperProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  cardStyle = { marginBottom: 0 },
  containerStyle = {},
  onReset,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState(children);
  const position = new Animated.ValueXY();
  const maxVisibleCards = 4;

  useEffect(() => {
    setCards(children);
    setCurrentIndex(0);
  }, [children]);

  const resetCards = () => {
    const newCards = onReset ? onReset() : children;
    setCards(newCards);
    setCurrentIndex(0);
    position.setValue({ x: 0, y: 0 });
  };

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const cardStyleAnimated = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
    opacity: 1,
    bottom: 0,
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        Animated.timing(position, {
          toValue: { x: width + 100, y: gesture.dy },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onSwipeRight?.(currentIndex);
          const swipedCard = cards[currentIndex];
          setCards((prev) => [...prev, swipedCard]);
          setCurrentIndex((prev) => prev + 1);
          position.setValue({ x: 0, y: 0 });
        });
      } else if (gesture.dx < -120) {
        Animated.timing(position, {
          toValue: { x: -width - 100, y: gesture.dy },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onSwipeLeft?.(currentIndex);
          setCurrentIndex((prev) => prev + 1);
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {cards
        .map((child, index) => {
          if (index < currentIndex) return null;

          const isCurrent = index === currentIndex;
          const visibleIndex = index - currentIndex;

          if (visibleIndex >= maxVisibleCards) return null;

          const scaleFactor = visibleIndex * 45;
          const reducedWidth = width * 0.8 - scaleFactor;
          const reducedHeight = height * 0.45 - scaleFactor;

          return (
            <Animated.View
              key={index}
              style={[
                styles.card,
                {
                  bottom: visibleIndex * -20,
                  opacity: 1 - visibleIndex * 0.3,
                  width: reducedWidth,
                  height: reducedHeight,
                  left: scaleFactor / 2,
                },
                cardStyle,
                isCurrent && cardStyleAnimated,
              ]}
              {...(isCurrent ? panResponder.panHandlers : {})}
            >
              {child}
            </Animated.View>
          );
        })
        .reverse()}
      {currentIndex >= cards.length && (
        <View style={styles.resetContainer}>
          <View style={styles.resetButton} onTouchStart={resetCards}>
            <Animated.Text style={styles.resetText}>Reset Cards</Animated.Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  card: {
    position: 'absolute',
    backgroundColor: '#283537',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#283537',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetContainer: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: 'rgba(80,78,118,.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resetText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Swiper;
