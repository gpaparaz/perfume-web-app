import { Outlet } from "react-router-dom";
import "./App.css";
import BackToTop from "./CustomComponents/BackToTop";
import Header from "./Header/Header";

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container d-flex flex-wrap justify-content-between gap-3">
          <span className="wordmark fs-5">Perfume Database</span>
          <span>Data: Première Peau · Fragrantica · Parfumo</span>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
}

export default App;
