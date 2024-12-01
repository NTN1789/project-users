// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserTable from './components/index';
import UserForm from './components/cadastroUsuario';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserTable />} />
        <Route path="/novo-usuario" element={<UserForm />} />
        <Route path="/editar-usuario/:id" element={<UserForm />} />
      </Routes>
    </Router>
  );
};

export default App;
