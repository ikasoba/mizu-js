import { $, Component, useState, h, onCleanup, State } from "mizu-js";

const Timer = Component(
  ({ count = useState(0) }: { count?: State<number> }) => {
    const interval = setInterval(() => {
      count.value++;
      console.log(count.value);
    }, 1000);

    onCleanup(() => clearInterval(interval));

    //prettier-ignore
    return $
      .createElement("div")
      .append(
        $(() => count.value, [count])
      );
  }
);

const App = Component(() => {
  const isHidden = useState(false);

  return (
    <div>
      <button onClick={() => (isHidden.value = !isHidden.value)}>
        {$(() => (isHidden.value ? "hide" : "show"), [isHidden])}
      </button>
      {$(() => (isHidden.value ? <Timer /> : ""), [isHidden])}
    </div>
  );
});

console.log(document.body);

$(document.body).append(<App />);
