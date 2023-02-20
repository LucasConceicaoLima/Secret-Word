import './StartScreen.css'

const StartScreen = ({startGame}) => {
  return (
    <div className="start">
        <h1>Secret Word</h1>
        <p>Aperte o botão para iniciar</p>
        <button onClick={startGame}>Start</button>
    </div>
  )
}

export default StartScreen