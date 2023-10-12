import { ReactNode, createContext, useState, useReducer } from "react";
import { ICycle, cyclesReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptedCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";

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
  }
);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  const { activeCycleId, cycles } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

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