import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GlobalStyle } from './core/components/globalStyle';

import { Landing } from './pages/landing';

const App = (): JSX.Element => {
  // main return
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
      <GlobalStyle />
    </BrowserRouter>
  );
};

export default App;
