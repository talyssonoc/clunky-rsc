import * as React from "react";

export default function Counter() {
  const [count, setCount] = React.useState(0);

  function increase() {
    setCount((c) => c + 1);
  }

  return (
    <div>
      {count}
      <button onClick={increase}>Increase</button>
    </div>
  );
}

// export { Counter };
