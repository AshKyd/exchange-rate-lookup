import { useEffect } from "preact/hooks";
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
      fromVal: upperQuery,
      toVal: "USD",
    };
  }

  const [, amount, fromVal, , toVal] =
    upperQuery
      .replace(/^CONVERT\s/, "")
      .match(/^(.*)\s(...)\s(\w+\s)?(...)$/) || [];

  if (!amount || !fromVal || !toVal) {
    return { error: "Could not parse query" };
  }
  const sanitisedAmount = Number(amount.replace(/[^\d]/g, ""));
  return {
    amount: sanitisedAmount,
    fromVal,
    toVal,
  };
}

export default function Results() {
  const query = new URLSearchParams(window.location.search).get("q");
  const { fromVal, toVal, amount, error } = parseQuery(query);

  const lang = navigator.language;

  if (error) {
    return (
      <article class="builder__centre-modal results">
        <p>Couldn't understand the query.</p>
        <p>
          Try <code>'convert 1 usd to aud'</code>
        </p>
      </article>
    );
  }

  const { amountInNewCurrency, exchangeRate } = getExchange(
    fromVal,
    toVal,
    amount,
    rates.value
  );

  const fromAmountFormatted = new Intl.NumberFormat(lang, {
    style: "currency",
    currency: fromVal,
  })
    .format(amount)
    .replace(".00", "");

  const toAmountFormatted = new Intl.NumberFormat(lang, {
    style: "currency",
    currency: toVal,
  }).format(amountInNewCurrency);

  useEffect(() => {
    document.title = `Exchange: ${fromAmountFormatted} is ${toAmountFormatted}`;
  }, []);
  return (
    <article class="builder__centre-modal results">
      <div class="results__main">
        <div class="results__main-info">
          <span class="amount results__numeric">{fromAmountFormatted}</span>{" "}
          <span class="fromVal">{fromVal}</span> <span class="in">in</span>{" "}
          <span class="toVal">{toVal}</span> <span class="is">is</span>
        </div>

        <div class="results__main-value results__numeric">
          {toAmountFormatted}
        </div>
      </div>
      <div class="results__supp">
        <span class="results__numeric">
          {new Intl.NumberFormat(lang, {
            style: "currency",
            currency: toVal,
          }).format(1)}
        </span>{" "}
        is currently{" "}
        <span class="results__numeric">
          {new Intl.NumberFormat(lang, {
            style: "currency",
            currency: fromVal,
          }).format(1 / exchangeRate)}
        </span>{" "}
      </div>
    </article>
  );
}
