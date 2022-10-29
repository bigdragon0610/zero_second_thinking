import { RestartAlt } from "@mui/icons-material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { Box, IconButton, TextField } from "@mui/material";
import { useRef } from "react";
import { PatternFormat } from "react-number-format";
import { useTimer } from "react-timer-hook";

const Timer = () => {
  const DEFAULT_THINKING_TIME = 90;
  const getExpiryTimestamp = (time) => {
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + time);
    return expiryTimestamp;
  };

  const expiryTimestamp = getExpiryTimestamp(DEFAULT_THINKING_TIME);
  const { isRunning, seconds, minutes, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => alert("タイマーが終了しました"),
    autoStart: false,
  });
  const timerRef = useRef();

  const formatTime = (time) => {
    let min = Math.floor(time / 60);
    min = ("00" + min).slice(-2);
    let sec = time % 60;
    sec = ("00" + sec).slice(-2);
    return `${min}:${sec}`;
  };

  const parseInput = (input) => {
    let [min, sec] = input !== "" ? input.split(":") : 0;
    [min, sec] = [Number(min), Number(sec)];
    return min * 60 + sec;
  };

  const toggleTimer = () => {
    if (isRunning) {
      pause();
    } else {
      resume();
    }
  };

  const onHandleTimerChange = (e) => {
    timerRef.current.value = e.target.value;
  };

  const setTimer = () => {
    const parsedInput = parseInput(timerRef.current.value);
    const newExpiryTimestamp = getExpiryTimestamp(parsedInput);
    restart(newExpiryTimestamp, false);
  };

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <PatternFormat
        format='##:##'
        value={formatTime(seconds + 60 * minutes)}
        customInput={TextField}
        variant='standard'
        sx={{ width: "72px", pointerEvents: isRunning ? "none" : "auto" }}
        inputProps={{
          sx: {
            color: "white",
            fontSize: "18px",
            textAlign: "center",
            mt: 0.2,
          },
        }}
        inputRef={timerRef}
        onChange={onHandleTimerChange}
        onBlur={setTimer}
      />
      <IconButton sx={{ color: "white", width: 26 }} onClick={toggleTimer}>
        {isRunning ? <StopIcon /> : <PlayArrowIcon />}
      </IconButton>
      <IconButton
        sx={{ width: 26 }}
        onClick={() => {
          const newExpiryTimestamp = new Date();
          newExpiryTimestamp.setSeconds(
            newExpiryTimestamp.getSeconds() + DEFAULT_THINKING_TIME
          );
          restart(newExpiryTimestamp, false);
        }}
      >
        <RestartAlt sx={{ color: "white" }} />
      </IconButton>
    </Box>
  );
};

export default Timer;
