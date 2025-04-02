import { render } from "preact";

import { Home } from "./pages/Home/index.jsx";
import "./style.css";
import { useEffect } from "preact/hooks";
import { rates } from "./signals.js";
import Results from "./pages/Results/Results.jsx";

export function App() {
  useEffect(() => {
    fetch("https://aapi.kyd.au/exchange/latest")
      .then((res) => res.json())
      .then((data) => {
        rates.value = data.rates;
      })
      .catch(console.error);
  }, []);
  if (!rates.value) {
    return <article class="builder__centre-modal">…</article>;
  }

  if (window.location.search) {
    return <Results />;
  }
  return <Home />;
}

render(<App />, document.getElementById("app"));
