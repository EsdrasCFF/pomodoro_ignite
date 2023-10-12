import { ReactNode, createContext, useState, useReducer } from "react";

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

interface ICyclesState {
  cycles: ICycle[],
  activeCycleId: string | null
}
export const CyclesContext = createContext({} as ICycleContextData)

export function CyclesContextProvider({children}: ICyclesContextProvider) {
  const [cyclesState, dispatch] = useReducer((state:ICyclesState, action: any) => {
    
    if(action.type === 'ADD_NEW_CYCLE') {
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }
    }

    if(action.type === 'INTERRUPT_CURRENT_CYCLE') {
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return {...cycle, interruptedDate: new Date()}
          } else {
            return state;
          }
        }),
        activeCycleId: null,
      }
    }
    return state
  }, 
  {
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
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId
      }
    })
    
    /*setCycles((state) => 
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )*/
  }

  function createNewCycle(data: ICreateCycleData) {
    const id = String(new Date().getTime())
    
    const newCycle: ICycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle
      }
    })

    //setCycles(prevState => [...prevState, newCycle])
    //setActiveCycleId(id)
    setAmountSecondsPassed(0)
  }

  function interruptedCurrentCycle() {

    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId
      }
    })



    /*setCycles((state) => state.map(cycle => {
      if(cycle.id === activeCycleId) {
        return { ...cycle, interruptedDate: new Date() }
      } else {
        return cycle
      }
    }))*/

    //setActiveCycleId(null);

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