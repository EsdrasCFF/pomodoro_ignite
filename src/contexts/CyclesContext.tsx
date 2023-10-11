import { ReactNode, createContext, useState } from "react";

interface ICreateCycleData {
  task: string,
  minutesAmount: number,
}

interface ICycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date,
  interruptedDate?: Date,
  finishedDate?: Date 
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
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<null | string>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) => 
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function createNewCycle(data: ICreateCycleData) {
    const id = String(new Date().getTime())
    
    const newCycle: ICycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles(prevState => [...prevState, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    //reset()
  }

  function interruptedCurrentCycle() {
    setCycles((state) => state.map(cycle => {
      if(cycle.id === activeCycleId) {
        return { ...cycle, interruptedDate: new Date() }
      } else {
        return cycle
      }
    }))

    setActiveCycleId(null);

  }

  return (
    <CyclesContext.Provider 
      value={{
        cycles, 
        activeCycle, 
        activeCycleId, 
        markCurrentCycleAsFinished, 
        amountSecondsPassed, 
        setSecondsPassed,
        createNewCycle,
        interruptedCurrentCycle
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}