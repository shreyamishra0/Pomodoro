import { useState, useEffect } from 'react';
import './App.css'

import playImg from "./assets/play.png";
import resetImg from "./assets/reset.png";
import workBtnClicked from "./assets/work-clicked.png";
import workBtn from "./assets/work.png";
import breakBtnClicked from "./assets/break-clicked.png";
import breakBtn from "./assets/break.png";
import idleGif from "./assets/idle.gif";
import workGif from "./assets/work.gif";
import breakGif from "./assets/break.gif";
import meowSound from "./assets/meow.mp3";
import closeBtn from "./assets/close.png";
import backgroundBlue from "./assets/background-blue.png";
import minimizeBtn from "./assets/minimize.png";
import background2 from "./assets/background-img2.png";

function App() {

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isEditing, setIsEditing] = useState(false);
  const [inputTime, setInputTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [breakButtonImage, setBreakButtonImage] = useState(breakBtn);
  const [workButtonImage, setWorkButtonImage] = useState(workBtn);
  const [gifImage, setGifImage] = useState(idleGif);
  const [isBreak, setIsBreak] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(backgroundBlue);
  const [image, setImage] = useState(playImg);
  const [Encouragement, setEncouragement] = useState("");

  const cheerMessages = [
    "You can do it!",
    "Keep going!",
    "Stay focused!",
  ];

  const breakMessages = [
    "Stay hydrated!",
    "Snacks, maybe?",
    "Stretch your legs!"
  ];

  const images = [
    backgroundBlue,
    background2,
  ];

  // Encouragement message updater - Fixed timer type
  useEffect(() => {
    let messageInterval: ReturnType<typeof setInterval>;

    if (isRunning) {
      const messages = isBreak ? breakMessages : cheerMessages;
      setEncouragement(messages[0]);
      let index = 1;

      messageInterval = setInterval(() => {
        setEncouragement(messages[index]);
        index = (index + 1) % messages.length;
      }, 4000); // every 4 seconds
    } else {
      setEncouragement("");
    }
    return () => clearInterval(messageInterval);
  }, [isRunning, isBreak]);

  useEffect(() => {
    let imageInterval: ReturnType<typeof setInterval>;
    let index = 0;
    imageInterval = setInterval(() => {
      setBackgroundImage(images[index]);
      index = (index + 1) % images.length;
    }, 1000); // Change image every 1 seconds
    return () => clearInterval(imageInterval);
  }, []);


  // Countdown timer - Fixed timer type
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    switchMode(false);
  }, []);

  // Fixed dependencies array to include all used variables
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      // Create audio instance inside effect to avoid stale closure
      const meowAudio = new Audio(meowSound);
      meowAudio.play().catch(err => {
        console.error("Audio play failed:", err);
      });
      setIsRunning(false);
      setImage(playImg);
      setGifImage(idleGif);
      setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    }
  }, [timeLeft, isRunning, isBreak]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setBreakButtonImage(breakMode ? breakBtnClicked : breakBtn);
    setWorkButtonImage(breakMode ? workBtn : workBtnClicked);
    setTimeLeft(breakMode ? 5 * 60 : 25 * 60);
    setGifImage(idleGif);
    setImage(playImg);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
    console.log('Timer clicked!'); // Debug log
    e.preventDefault();
    e.stopPropagation();
    setInputTime(formatTime(timeLeft));
    setIsEditing(true);
  };

  const handleTimeSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const [minutes, seconds] = inputTime.split(':').map(Number);
    const newTimeLeft = (minutes * 60) + seconds;
    setTimeLeft(newTimeLeft);
    setIsEditing(false);
  }

  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
      setGifImage(isBreak ? breakGif : workGif);
      setImage(resetImg);
    } else {
      setIsRunning(false);
      setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
      setGifImage(idleGif);
      setImage(playImg);
    }
  };

  const handleCloseClick = () => {
    if (window.electronAPI?.closeApp) {
      window.electronAPI.closeApp();
    } else {
      console.warn("Electron API not available");
    }
  };

  const handleMinimizeClick = () => {
    if (window.electronAPI?.minimizeApp) {
      window.electronAPI.minimizeApp();
    } else {
      console.warn("Electron API not available");
    }
  };

  const containerClass = `home-container ${isRunning ? "background-green" : ""}`;

  return (
    <div
      className={containerClass}
      style={{
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <div className="window-controls">
        <button className='minimize-button' onClick={handleMinimizeClick}>
          <img src={minimizeBtn} alt="Minimize" />
        </button>
        <button className='close-button' onClick={handleCloseClick}>
          <img src={closeBtn} alt="Close" />
        </button>
      </div>

      <div className='home-content'>
        <div className='home-controls'>
          <button className='image-button' onClick={() => switchMode(false)}>
            <img src={workButtonImage} alt="Work" />
          </button>
          <button className='image-button' onClick={() => switchMode(true)}>
            <img src={breakButtonImage} alt="Break" />
          </button>
        </div>

        <p className={`encouragement-text ${isRunning ? 'visible' : ''}`}>
          {Encouragement}
        </p>

        {isEditing ? (
          <form onSubmit={handleTimeSubmit} className="timer-edit-form">
            <input
              type="text"
              value={inputTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputTime(e.target.value)}
              placeholder="MM:SS"
              pattern="[0-9]{1,2}:[0-9]{2}"
              className="timer-input"
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          </form>
        ) : (
          <>
            <h1 className='home-timer' onClick={handleEditClick}>
              {formatTime(timeLeft)}
            </h1>
            <img src={gifImage} alt="Timer Status" className='gif-image' />
          </>
        )}

        <button className='home-button' onClick={handleClick}>
          <img src={image} alt="Button Icon" />
        </button>
      </div>
    </div>
  );
}

export default App;
