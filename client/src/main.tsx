import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import GlossaryPresenter from "./Glossary/GlossaryPresenter.tsx";
import HomeDashboard from "./Home/HomeDashboard.tsx";
import IngredientInspect from "./IngredientInspect/IngredientInspect.tsx";
import "./index.css";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomeDashboard />} />
          <Route path="glossary" element={<GlossaryPresenter />} />
          <Route path="/glossary/:id" element={<IngredientInspect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
