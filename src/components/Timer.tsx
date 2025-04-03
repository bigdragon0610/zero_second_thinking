import { RestartAlt } from "@mui/icons-material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { Box, IconButton, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { PatternFormat } from "react-number-format";
import { useTimer } from "react-timer-hook";

const Timer = () => {
  const DEFAULT_THINKING_TIME = 90;
  const getExpiryTimestamp = (time: number): Date => {
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

  // PatternFormatが期待するref型を修正
  const timerRef = useRef<any>(null);

  const formatTime = (time: number): string => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const parseInput = (input: string): number => {
    if (input === '') return 0;
    const parts = input.split(':');
    if (parts.length !== 2) return 0;
    
    const min = parseInt(parts[0], 10) || 0;
    const sec = parseInt(parts[1], 10) || 0;
    return min * 60 + sec;
  };

  const toggleTimer = () => {
    if (isRunning) {
      pause();
    } else {
      resume();
    }
  };

  const onHandleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      timerRef.current.value = e.target.value;
    }
  };

  const setTimer = () => {
    const parsedInput = parseInput(timerRef.current.value);
    const newExpiryTimestamp = getExpiryTimestamp(parsedInput);
    restart(newExpiryTimestamp, false);
  };

  const ref = useRef(true);
  useEffect(() => {
    if (ref.current) {
      document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.shiftKey) return;
        if (e.key === "r" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          const newExpiryTimestamp = getExpiryTimestamp(DEFAULT_THINKING_TIME);
          restart(newExpiryTimestamp);
        }
      });
      ref.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <PatternFormat
        format="##:##"
        value={formatTime(seconds + 60 * minutes)}
        customInput={TextField}
        variant="standard"
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
