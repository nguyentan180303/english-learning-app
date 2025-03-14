import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import QuitGameButton from '../components/quitgame';
import Scoreboard from '../components/score';
import { playSound } from '../sound/FlippingCard';

const wordPairs = [
  { english: 'Cat', vietnamese: 'Mèo' },
  { english: 'Dog', vietnamese: 'Chó' },
  { english: 'Happy', vietnamese: 'Vui' },
  { english: 'Sad', vietnamese: 'Buồn' },
  { english: 'Run', vietnamese: 'Chạy' },
  { english: 'Eat', vietnamese: 'Ăn' },
  { english: 'Big', vietnamese: 'Lớn' },
  { english: 'Small', vietnamese: 'Nhỏ' },
  { english: 'Book', vietnamese: 'Sách' },
  { english: 'Table', vietnamese: 'Bàn' },
  { english: 'Jump', vietnamese: 'Nhảy' },
  { english: 'Sleep', vietnamese: 'Ngủ' },
  { english: 'Beautiful', vietnamese: 'Đẹp' },
  { english: 'Fast', vietnamese: 'Nhanh' },
  { english: 'Friend', vietnamese: 'Bạn' },
  { english: 'Work', vietnamese: 'Làm' },
];

const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const MemoryFlipGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);
  const [gridLayout, setGridLayout] = useState({ rows: 2, cols: 2 }); // Default to 2x2 grid
  const matchedIndicesRef = useRef([]);

  useEffect(() => {
    startNewRound();
  }, [round]);

  const startNewRound = () => {
    let gridConfig;
    if (round <= 2) {
      gridConfig = { rows: 2, cols: 2 }; // 2x2 grid for the first 2 rounds
    } else if (round <= 5) {
      gridConfig = { rows: 3, cols: 2 }; // 3x2 grid for rounds 3-5
    } else if (round <= 9) {
      gridConfig = { rows: 4, cols: 2 }; // 4x2 grid for rounds 6-9
    } else if (round <= 13) {
      gridConfig = { rows: 4, cols: 3 }; // 4x3 grid for rounds 10-13
    } else {
      gridConfig = { rows: 4, cols: 4 }; // 4x4 grid for unlimited rounds after round 14
    }

    const totalCards = gridConfig.rows * gridConfig.cols;
    const selectedPairs = shuffleArray(wordPairs).slice(0, totalCards / 2);

    const newCards = selectedPairs.flatMap((pair, pairIndex) => [
      { ...pair, id: pairIndex * 2, type: 'english', isFlipped: false, rotateValue: new Animated.Value(0) },
      { ...pair, id: pairIndex * 2 + 1, type: 'vietnamese', isFlipped: false, rotateValue: new Animated.Value(0) },
    ]);

    setCards(shuffleArray(newCards));
    setFlippedIndices([]);
    matchedIndicesRef.current = [];
    setGameOver(false);
    setGridLayout(gridConfig); // Set the grid layout (rows, cols)
  };

  const handleCardPress = (index) => {
    if (flippedIndices.length === 2 || gameOver || cards[index].isFlipped || matchedIndicesRef.current.includes(index)) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    setTimeout(() => {
      playSound(require('../soundassets/FlippingCardsound/FCopen.mp3'));
    }, -1000);
    flipCard(index);

    if (newFlippedIndices.length === 2) {
      checkMatch(newFlippedIndices);
    }
  };

  const flipCard = (index) => {
    const card = cards[index];
    Animated.timing(card.rotateValue, {
      toValue: card.isFlipped ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const checkMatch = (indices) => {
    const [firstIndex, secondIndex] = indices;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    const isMatch =
      firstCard.english === secondCard.english &&
      firstCard.vietnamese === secondCard.vietnamese;

    if (isMatch) {
      const randomColor = getRandomColor();
      const newCards = [...cards];
      newCards[firstIndex].backgroundColor = randomColor;
      newCards[secondIndex].backgroundColor = randomColor;
      setCards(newCards);

      matchedIndicesRef.current = [...matchedIndicesRef.current, firstIndex, secondIndex];
      if (matchedIndicesRef.current.length !== cards.length)  
        setTimeout(() => {
          playSound(require('../soundassets/FlippingCardsound/FCcorrect.mp3'));
        }, 600);
      setScore((prev) => prev + 1);
      if (matchedIndicesRef.current.length === cards.length) {
        setGameOver(true);
        playSound(require('../soundassets/FlippingCardsound/FCcongra.mp3'));
        setTimeout(() => {
          setRound((prev) => prev + 1); // Go to the next round
        }, 2000);
      }
    } else {
      setTimeout(() => {
        const newCards = [...cards];
        newCards[firstIndex].isFlipped = false;
        newCards[secondIndex].isFlipped = false;
        setCards(newCards);
        flipCard(firstIndex);
        flipCard(secondIndex);
        playSound(require('../soundassets/FlippingCardsound/FCclose.mp3'));
      }, 1000);
    }

    setFlippedIndices([]);
  };

  const rotateInterpolation = (rotateValue) => {
    return rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
  };

  const getBackfaceVisibility = (isFlipped) => {
    return isFlipped ? 'visible' : 'hidden';
  };

  const getCardWidth = () => {
    const { cols } = gridLayout;
    return `${100 / cols - 4}%`; // Calculate the width based on the number of columns
  };

  return (
    <View style={styles.container}>
      <QuitGameButton />
      <Scoreboard score={score} />
      <View style={styles.gridContainer}>
        {cards.map((card, index) => {
          const rotate = rotateInterpolation(card.rotateValue);

          return (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, { width: getCardWidth() }]}
              onPress={() => handleCardPress(index)}
              disabled={card.isFlipped || matchedIndicesRef.current.includes(index) || gameOver}
            >
              <Animated.View
                style={[styles.cardInner, { transform: [{ rotateY: rotate }] }]}
              >
                <View
                  style={[styles.cardFace, styles.cardFront, { backfaceVisibility: getBackfaceVisibility(card.isFlipped) }]}
                ></View>
                <View
                  style={[styles.cardFace, styles.cardBack, {
                    backfaceVisibility: getBackfaceVisibility(card.isFlipped),
                    backgroundColor: matchedIndicesRef.current.includes(index) ? card.backgroundColor : '#fff',
                  }]}
                >
                  <Text style={styles.cardText}>
                    {card.isFlipped || matchedIndicesRef.current.includes(index)
                      ? card.type === 'english'
                        ? card.english
                        : card.vietnamese
                      : ''}
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    perspective: 1000,
  },
  card: {
    height: 120,
    margin: '1.5%',
  },
  cardInner: {
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 10,
  },
  cardFront: {
    backgroundColor: '#ccc',
  },
  cardBack: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotateY: '180deg' }],
  },
  cardText: {
    fontSize: 18,
  },
});

export default MemoryFlipGame;
