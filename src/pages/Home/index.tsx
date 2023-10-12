import { HandPalm, Play } from "phosphor-react";
import { useContext } from "react";

import { HomeContainer, StartCountdownButton, StopCountdownButton} from "./styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a Tarega que deseja realizar!"),
  minutesAmount: zod.number().min(5).max(60),
})

interface INewCycleFormData {
  task: string,
  minutesAmount: number
}

export function Home() {
  const { createNewCycle, interruptedCurrentCycle, activeCycle } = useContext(CyclesContext)

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

  function handleCreateNewCycle(data: INewCycleFormData) {
    createNewCycle(data);
    reset()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} >
        
        <FormProvider {...newCycleForm} >
          <NewCycleForm/>
        </FormProvider>

        <Countdown />
        
        { activeCycle ? (
          <StopCountdownButton onClick={interruptedCurrentCycle} type="button">
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