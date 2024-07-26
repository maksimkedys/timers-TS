import { createContext, useContext, useReducer, type ReactNode } from "react";

export type Timer = {
  name: string;
  duration: number;
};

type TimersState = {
  isRunning: boolean;
  timers: Timer[];
};

const initialState: TimersState = {
  timers: [],
  isRunning: false,
};

type TimersContextValue = TimersState & {
  addTimer: (timerData: Timer) => void;
  startTimers: () => void;
  stopTimers: () => void;
};

export const TimersContext = createContext<TimersContextValue | null>(null);

type TimersContextProviderProps = {
  children: ReactNode;
};

type StartTimersAction = {
  type: "timers/start";
};

type StopTimersAction = {
  type: "timers/stop";
};

type AddTimerAction = {
  type: "timer/add";
  payload: Timer;
};

type Action = StartTimersAction | StopTimersAction | AddTimerAction;

function timersReducer(state: TimersState, action: Action): TimersState {
  if (action.type === "timers/start") {
    return {
      ...state,
      isRunning: true,
    };
  }
  if (action.type === "timers/stop") {
    return {
      ...state,
      isRunning: false,
    };
  }
  if (action.type === "timer/add") {
    return {
      ...state,
      timers: [
        ...state.timers,
        { name: action.payload.name, duration: action.payload.duration },
      ],
    };
  }

  return state;
}

function TimersContextProvider({ children }: TimersContextProviderProps) {
  const [{ isRunning, timers }, dispatch] = useReducer(
    timersReducer,
    initialState
  );

  const ctx: TimersContextValue = {
    timers,
    isRunning,

    addTimer(timerData) {
      dispatch({ type: "timer/add", payload: timerData });
    },

    startTimers() {
      dispatch({ type: "timers/start" });
    },

    stopTimers() {
      dispatch({ type: "timers/stop" });
    },
  };

  return (
    <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
  );
}

export function useTimersContext() {
  const timerCtx = useContext(TimersContext);

  if (timerCtx === null) {
    throw new Error("Something went wrong. TimersContext is null");
  }
  return timerCtx;
}

export default TimersContextProvider;
