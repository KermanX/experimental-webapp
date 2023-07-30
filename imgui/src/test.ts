import { div, button, p, numberInput } from "./dom.js";
import { view } from "./view.js";
import { d } from "./data.js";

let n = d(0);

view(() => {
  p(`Header ${n}`);
  div(() => {
    if (button("Click me!")) {
      console.log("click");
      n.value++;
    }
    p(`You clicked ${n} times `);
    numberInput(n);
  });
});
