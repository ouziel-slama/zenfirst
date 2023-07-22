import React from 'react';
import './styles/App.css';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

import { useCookies } from 'react-cookie';

function App() {

  const [cookies] = useCookies(['zenfirst-cookie']);

  if ('zenfirst-cookie' in cookies && cookies['zenfirst-cookie'].jwt) {
    return (
      <div className="App">
        <Dashboard />
      </div>
    );
  } else {
    return (
      <div className="App">
        <LoginForm />
      </div>
    );
  }
}

export default App;
