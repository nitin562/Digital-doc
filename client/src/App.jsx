import "./App.css";
import { ContextProvider } from "./Components/Context/ContextApi";
import Home from "./Components/Home";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
