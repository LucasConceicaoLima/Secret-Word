import './App.css';

import {useCallback, useState, useEffect} from "react";

import StartScreen from './components/StartScreen';
import Game from './components/Game'
import GameOver from './components/GameOver'

import {wordsList} from './data/words';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "gameover"},
]

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    return {word, category};
  },[words]);

  const startGame = useCallback(() => {
    clearStates();
    const {word, category} = pickWordAndCategory();
    
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const corrigida = letter.toLowerCase()
    if(guessedLetters.includes(corrigida)||wrongLetters.includes(corrigida)){
      return;
    }

    if(letters.includes(corrigida)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, corrigida
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, corrigida
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);

    }
  };

  const clearStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(()=>{
    if(guesses<=0){
      clearStates();
      setGameStage(stages[2].name);
    }
  },[guesses]);

  useEffect(()=>{
    const uniqueLetters = [...new Set(letters)]; //remove duplicadas
    if(guessedLetters.length===uniqueLetters.length){
      setScore((actualScore) => actualScore += 50);
      startGame();
    }
    
  },[guessedLetters, letters, startGame]);

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}></StartScreen>}
      {gameStage === "game" && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}></Game>}
      {gameStage === "gameover" && <GameOver retry={retry} score={score}></GameOver>}
      
    </div>
  );
}

export default App;
