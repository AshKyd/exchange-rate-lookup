import { rates } from "../../signals";

function getExchange(fromVal, toVal, amount, values) {
  const fromValInUsd = values[fromVal];
  const toValInUsd = values[toVal];
  const exchangeRate = (1 / fromValInUsd) * toValInUsd;
  const amountInNewCurrency = amount * exchangeRate;
  return { exchangeRate, amountInNewCurrency };
}

function parseQuery(query) {
  const upperQuery = query.toUpperCase();
  if (upperQuery.length === 3) {
    return {
      amount: 1,
      fromVal: "USD",
      toVal: upperQuery,
    };
  }

  const [, amount, fromVal, , toVal] =
    upperQuery.match(/^(.*)\s(...)\s(\w+\s)?(...)$/) || [];
  const sanitisedAmount = Number(amount.replace(/[^\d]/g, ""));
  return {
    amount: sanitisedAmount,
    fromVal,
    toVal,
  };
}

export default function Results() {
  const query = new URLSearchParams(window.location.search).get("q");
  const { fromVal, toVal, amount } = parseQuery(query);

  const { amountInNewCurrency, exchangeRate } = getExchange(
    fromVal,
    toVal,
    amount,
    rates.value
  );
  return (
    <article class="builder__centre-modal results">
      <div class="results__main">
        <div class="results__main-info">
          <span class="amount results__numeric">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: fromVal,
            })
              .format(amount)
              .replace(".00", "")}
          </span>{" "}
          <span class="fromVal">{fromVal}</span> <span class="in">in</span>{" "}
          <span class="toVal">{toVal}</span> <span class="is">is</span>
        </div>

        <div class="results__main-value results__numeric">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: toVal,
          }).format(amountInNewCurrency)}
        </div>
      </div>
      <div class="results__supp">
        <span class="results__numeric">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: toVal,
          }).format(1)}
        </span>{" "}
        is currently{" "}
        <span class="results__numeric">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: fromVal,
          }).format(1 / exchangeRate)}
        </span>{" "}
        {fromVal}
      </div>
    </article>
  );
}
