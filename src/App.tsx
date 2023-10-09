import { ThemeProvider } from 'styled-components';
import { Button } from "./components/Button";

import { GlobalStyle } from './styles/global';
import  { defaultTheme } from './styles/themes/default';

export function App() {

  return (

    <ThemeProvider theme={defaultTheme} >
      <Button variant="secundary" />
      <Button variant="primary" />
      <Button variant="danger" />
      <Button variant="success"/>

      <GlobalStyle />
    </ThemeProvider>

    )
}
