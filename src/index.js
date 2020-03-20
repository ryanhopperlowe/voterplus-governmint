import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import AppRouter from './routers/AppRouter';
// BaseUi
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';


const engine = new Styletron();

const Root = () => (
  <StyletronProvider value={engine}>
    <BaseProvider theme={LightTheme}>
      <AppRouter />
    </BaseProvider>
  </StyletronProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
