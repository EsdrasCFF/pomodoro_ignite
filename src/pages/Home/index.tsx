import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import * as zod from "zod"

import { HomeContainer , FormContainer, CountdownContainer, Separator, StartCountdownButton, TaskInput, MinutesAmountInput} from "./styles";

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
  minutesAmount: number
}

export function Home() {
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<null | string>(null)
  
  const { register, handleSubmit, watch, reset } = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  });

  function handleCreateNewCycle(data: INewCycleFormData) {
    const id = String(new Date().getTime())
    
    const newCycle: ICycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount
    }

    setCycles(prevState => [...prevState, newCycle])
    setActiveCycleId(id)

    reset()
  }

  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

  console.log(activeCycle)

  const task = watch("task");
  const minutesAmount = watch("minutesAmount");
  const isSubmitDisabled = !task || !minutesAmount

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} >
        <FormContainer>
          <label htmlFor="task" >Vou trabalhar em</label>
          <TaskInput
            id="task" 
            list="task-suggestions" 
            placeholder="Dê um nome para o seu projeto" 
            {...register("task")}
          />

          <datalist  id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Projeto 4" />

          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput 
            type="number" 
            id="minutesAmount" 
            placeholder="00" 
            step={5}
            min={5}
            max={60}
            {...register("minutesAmount", {valueAsNumber: true})}
          />
          
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>

        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24}/>
          Começar
        </StartCountdownButton>

      </form>

    </HomeContainer>
  )
}