import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./Header/Header";

function App() {
  return (
    <div className="h-100 d-flex flex-column">
      <Header></Header>
      <main className="flex-grow-1 container my-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
