import { HandPalm, Play } from "phosphor-react";
import { createContext, useState } from "react";

import { HomeContainer, StartCountdownButton, StopCountdownButton} from "./styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

interface ICycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date,
  interruptedDate?: Date,
  finishedDate?: Date 
}

interface ICycleContextData {
  activeCycle: ICycle | undefined,
  activeCycleId: string | null,
  amountSecondsPassed: number,
  markCurrentCycleAsFinished: () => void,
  setSecondsPassed: (seconds: number) => void
}

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a Tarega que deseja realizar!"),
  minutesAmount: zod.number().min(5).max(60),
})

interface INewCycleFormData {
  task: string,
  minutesAmount: number
}


export const CyclesContext = createContext({} as ICycleContextData)

export function Home() {
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<null | string>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

  const newCycleForm = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const task = watch("task");
  const isSubmitDisabled = !task

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

  function handleCreateNewCycle(data: INewCycleFormData) {
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

    reset()
  }

  function handleInterruptedCycle() {
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
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} >
        
        <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed }}>
          <FormProvider {...newCycleForm} >
            <NewCycleForm/>
          </FormProvider>

          <Countdown />
        </CyclesContext.Provider>
        
        { activeCycle ? (
          <StopCountdownButton onClick={handleInterruptedCycle} type="button">
            <HandPalm size={24}/>
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton  disabled={isSubmitDisabled}  type="submit">
            <Play size={24}/>
            Começar
        </StartCountdownButton>
        )
        }

      </form>

    </HomeContainer>
  )
}