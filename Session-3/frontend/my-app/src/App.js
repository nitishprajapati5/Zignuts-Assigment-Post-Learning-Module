import {Route,Routes,BrowserRouter} from "react-router-dom"
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import AddTask from "./Components/AddTask";
import EditTask from "./Components/EditTask";

function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/task/create" element={<AddTask />} />
        <Route path="/edit/:id" element={<EditTask />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
