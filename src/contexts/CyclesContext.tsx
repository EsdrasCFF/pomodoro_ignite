import { ReactNode, createContext, useState, useReducer, useEffect } from "react";
import { ICycle, cyclesReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptedCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface ICreateCycleData {
  task: string,
  minutesAmount: number,
}

interface ICycleContextData {
  cycles: ICycle[],
  activeCycle: ICycle | undefined,
  activeCycleId: string | null,
  amountSecondsPassed: number,
  markCurrentCycleAsFinished: () => void,
  setSecondsPassed: (seconds: number) => void,
  createNewCycle: (data: ICreateCycleData) => void,
  interruptedCurrentCycle: () => void
}

interface ICyclesContextProvider {
  children: ReactNode
}


export const CyclesContext = createContext({} as ICycleContextData)

export function CyclesContextProvider({children}: ICyclesContextProvider) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  }, () => {
    const storedStateAsJSON = localStorage.getItem("@ignite-time:cycles-state-1.0.0")

    if(storedStateAsJSON) {
      return JSON.parse(storedStateAsJSON)
    }
  }
);

const { activeCycleId, cycles } = cyclesState;
const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  });

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: ICreateCycleData) {
    const id = String(new Date().getTime())
    
    const newCycle: ICycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  function interruptedCurrentCycle() {

    dispatch(interruptedCurrentCycleAction())
  }

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem("@ignite-time:cycles-state-1.0.0", stateJSON)
  }, [cyclesState])

  return (
    <CyclesContext.Provider 
      value={{
        cycles, 
        activeCycle, 
        activeCycleId, 
        amountSecondsPassed, 
        markCurrentCycleAsFinished, 
        setSecondsPassed,
        createNewCycle,
        interruptedCurrentCycle
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}