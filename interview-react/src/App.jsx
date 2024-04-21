import { useEffect, useRef, useState } from "react";
import "./App.css";

function formatTime(time) {
  const hours = Math.floor(time / (1000 * 60 * 60))
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((time / 1000) % 60)
    .toString()
    .padStart(2, "0");
  let milliseconds = (time % 1000).toString().padStart(2, "0");
  if (milliseconds === "00") {
    milliseconds = "000";
  }

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

function App() {
  const ref = useRef();
  const [timer, setTimer] = useState(0);
  const [laps, setLaps] = useState([]);
  const [isStoped, setIsStoped] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current.timer = 0;
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (isStoped) return;
    const interval = setInterval(function () {
      const time = ref.current.timer + 100;
      ref.current.timer = time;
      ref.current.textContent = formatTime(time);
    }, 100);

    return () => clearInterval(interval);
  }, [isStoped]);

  const lap = (time) => {
    setLaps([...laps, time]);
    serverLog(time);
  };

  const serverLog = (time) => {
    fetch("http://127.0.0.1:3000/log?time=" + time)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const reset = () => {
    setTimer(0);
    setLaps([]);
    ref.current.timer = 0;
    ref.current.textContent = formatTime(0);
  };

  const time = formatTime(timer);

  return (
    <>
      <h1 ref={ref}>{time}</h1>
      <button onClick={reset}>Reset</button>
      <button onClick={() => lap(ref.current.textContent)}>Lap</button>
      <button onClick={() => setIsStoped(!isStoped)}>
        {isStoped ? "Start" : "Stop"}
      </button>

      <ul>
        {laps.map((lap, index) => (
          <li key={index}>{lap}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
