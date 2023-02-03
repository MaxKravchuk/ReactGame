import './App.css';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const BIRD_SIZE = 20;
const GAME_HEIGHT = 500;
const GAME_WIDTH = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 70;
const OBSTALE_WIDTH = 40;
const OBSTALE_GAP = 200;

function App() {
  const [birdsPosition, setBirdsPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH-OBSTALE_WIDTH);
  const[score, setScore] = useState(0);

  const obstacleBottomHeight = GAME_HEIGHT - OBSTALE_GAP - obstacleHeight;

  useEffect(()=>{
    let timeID;
    if(gameHasStarted && birdsPosition < GAME_HEIGHT-BIRD_SIZE) {
      timeID = setInterval(()=> {
        setBirdsPosition(birdsPosition => birdsPosition + GRAVITY)
      }, 24)
    }
    return()=>{
      clearInterval(timeID);
    };

  }, [birdsPosition, gameHasStarted]);

  useEffect(()=>{
    let obstacleID;
    if(gameHasStarted && obstacleLeft >= -OBSTALE_WIDTH) {
      obstacleID = setInterval(()=>{
        setObstacleLeft((obstacleLeft)=> obstacleLeft - 5);
      },24);
      return () => {
        clearInterval(obstacleID);
      };
    }
    else{
      setObstacleLeft(GAME_WIDTH-OBSTALE_WIDTH);
      setObstacleHeight(Math.floor(Math.random()*(GAME_HEIGHT-OBSTALE_GAP)));
      setScore(score => score+1);
    }
  }, [gameHasStarted, obstacleLeft]);

  useEffect(()=>{
    const hasCollidedWithTopObstacle =
      birdsPosition >= 0 && birdsPosition < obstacleHeight;
    const hasCollidedWithBottomObstacle =
      birdsPosition <= 500 && birdsPosition >= 500 - obstacleBottomHeight;

    if(obstacleLeft >= 0 && obstacleLeft <= OBSTALE_WIDTH && (hasCollidedWithBottomObstacle || hasCollidedWithTopObstacle))
    {
      setGameHasStarted(false);
      setScore(0);
    }
  })

  const handleClick = () =>{
    let newBirdPosition = birdsPosition - JUMP_HEIGHT;
    if(!gameHasStarted){
      setGameHasStarted(true);
    }
    else if(newBirdPosition < 0)
    {
      setBirdsPosition(0);
    }
    else
    {
      setBirdsPosition(newBirdPosition);
    }
  }

  return (
    <div className="App">
      <Box onClick={handleClick}>
        <GameField height={GAME_HEIGHT} width={GAME_WIDTH}>
          <Obstacle
            top={0}
            width={OBSTALE_WIDTH}
            height={obstacleHeight}
            left={obstacleLeft}
          />
          <Obstacle
            top={GAME_HEIGHT - (obstacleHeight + obstacleBottomHeight) }
            width={OBSTALE_WIDTH}
            height={obstacleBottomHeight}
            left={obstacleLeft}
          />
          <Bird size={BIRD_SIZE} top={birdsPosition}/>
        </GameField>
        <span> {score} </span>
      </Box>
    </div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-color:red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Box = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span{
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameField = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  background-color: yellow;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  left: ${(props) => props.left}px;
`;