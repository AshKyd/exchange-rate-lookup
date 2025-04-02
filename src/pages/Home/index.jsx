import { useState } from "preact/hooks";
import { rates } from "../../signals";
import "./style.css";

export function Home() {
  const [fromVal, setFromVal] = useState("USD");
  const [toVal, setToVal] = useState("AUD");
  const [amount, setAmount] = useState("1");

  function onSubmit(e) {
    e.preventDefault();
    window.location.search = `?q=${amount} ${fromVal} to ${toVal}`;
  }

  return (
    <form class="builder__centre-modal" onSubmit={onSubmit}>
      <fieldset class="builder__spacious">
        <legend>Convert currency</legend>
        <div class="currency__inline">
          <label>
            From:
            <select onChange={(e) => setFromVal(e.target.value)}>
              {Object.keys(rates.value).map((value) => (
                <option selected={value === fromVal}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            To:
            <select onChange={(e) => setToVal(e.target.value)}>
              {Object.keys(rates.value).map((value) => (
                <option selected={value === toVal}>{value}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Amount:
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <div class="builder__submit-row">
          <button type="submit">Convert</button>
        </div>
      </fieldset>
    </form>
  );
}
