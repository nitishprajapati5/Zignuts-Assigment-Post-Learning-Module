import {Route,Routes,BrowserRouter} from "react-router-dom"
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import AddTask from "./Components/AddTask";

function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/task/create" element={<AddTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
