import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns"
import * as zod from "zod"

import { HomeContainer, StartCountdownButton, StopCountdownButton} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a Tarega que deseja realizar!"),
  minutesAmount: zod.number().min(5).max(60),
})

interface INewCycleFormData {
  task: string,
  minutesAmount: number
}

interface ICycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date,
  interruptedDate?: Date,
  finishedDate?: Date 
}

export function Home() {
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<null | string>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  
  const { register, handleSubmit, watch, reset } = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  });

  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, "0")
  const seconds = String(secondsAmount).padStart(2, "0")

  const task = watch("task");
  const isSubmitDisabled = !task

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

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const differenceSeconds = differenceInSeconds(new Date(), activeCycle.startDate);

        if(differenceSeconds >= totalSeconds) {
          setCycles((state) => 
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
          
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(differenceSeconds)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleId, totalSeconds])

  useEffect(() => {
    if(activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [activeCycle, minutes, seconds])
  
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} >
        

        <NewCycleForm/>
        <Countdown/>

        { activeCycle ? (
          <StopCountdownButton onClick={handleInterruptedCycle} type="button">
            <HandPalm size={24}/>
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24}/>
            Começar
        </StartCountdownButton>
        )
        }

      </form>

    </HomeContainer>
  )
}