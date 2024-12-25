
import './App.css';
import { Client } from 'appwrite';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Storage from './pages/storage';


function App() {
  const client = new Client();
  client.setProject('676194e1002a509ac47d');
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home/>}>        </Route>
        <Route path="/Register" element={<Register/>}>        </Route>     
        <Route path="/Login" element={<Login/>}>        </Route>
        <Route path="/Dashboard" element={<Dashboard/>}>        </Route>
        <Route path="/storage" element={<Storage/>}>        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
