// import { div, button, p, numberInput } from "./dom.js";
// import { view } from "./view.js";
// import { d } from "./data.js";

// let n = d(0);

// view(() => {
//   p(`Header ${n}`);
//   div(() => {
//     if (
//       button
//         .id("main-btn")
//         .cls("primary-btn")
//         .border(`${n % 3}px black solid`)("Click me!")
//     ) {
//       n.value++;
//     }
//     p(`You clicked ${n} times `);
//     numberInput("times", n);
//   });
//   for (let i = 0; i < n; i++) {
//     if (button("Click me! +" + i)) {
//       n.value += i;
//     }
//   }
// });

// // view(() => {
// //   p(`Header ${n}`);
// //   { using _ = div();
// //     if (button.id("main-btn")("Click me!")) {
// //       n.value++;
// //     }
// //     p(`You clicked ${n} times `);
// //     numberInput(n);
// //   }
// //   for(let i = 0; i < 10; i++) {
// //     if (button("Click me! +"+i)) {
// //       n.value+=i;
// //     }
// //   }
// // });
