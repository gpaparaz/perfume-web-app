import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import IngredientsPresenter from "./Ingredient/IngredientsPresenter.tsx";
import HomeDashboard from "./Home/HomeDashboard.tsx";
import IngredientInspect from "./IngredientInspect/IngredientInspect.tsx";
import BrandPresenter from "./Perfumes/BrandPresenter.tsx";
import PerfumeInspect from "./Perfumes/PerfumeInspect.tsx";
import "./index.css";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomeDashboard />} />
          <Route path="ingredient" element={<IngredientsPresenter />} />
          <Route path="/ingredient/:id" element={<IngredientInspect />} />
          <Route path="perfumes" element={<BrandPresenter />} />
          <Route path="/perfumes/:id" element={<PerfumeInspect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
