import { ThemeProvider } from 'styled-components';
import { Button } from "./components/Button";

import { GlobalStyle } from './styles/global';
import  theme from './styles/themes/default';

export function App() {

  return (

    <ThemeProvider theme={theme} >
      <Button variant="secundary" />
      <Button variant="primary" />
      <Button variant="danger" />
      <Button variant="success"/>

      <GlobalStyle />
    </ThemeProvider>

    )
}
