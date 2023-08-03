import { ButtonElement } from "./components/dom.imgui.js";
import { d, ref, view, toRaw } from "./lib.js";

// let username = d("");
// let password = d("");
// let name = d("");
// let age = d(0);
// let table = d([
//   { name: "John", age: 20 },
//   { name: "Mary", age: 30 },
//   { name: "Bob", age: 40 },
// ]);
// let btn = ref<ButtonElement>();
// let btn2 = ref<ButtonElement>();
/*_.div<"#main">(() => {
    _.p<"{font-size:x-large}">(`Login to ZVMS`);
    _.textInput("Username: ", username);
    _.textInput("Password: ", password);
    if (_.button<".primary-btn">("Login").as(btn)) {
      alert(`${username} : ${password}`);
    }
    let valid = username.value.length > 0 && password.value.length > 0;
    btn.current.disabled = !valid;
    if (!valid) {
      _.p(`Please enter a username and password`);
    }
    _.style(`
    .primary-btn {
      background-color: aliceblue;
      border: 2px solid black;
    }`);
  });*/

const name = d("");
const age = d(0);
const table = [
  { name: "John", age: 20 },
  { name: "Mary", age: 30 },
  { name: "Bob", age: 40 },
];
const btn = ref<ButtonElement>();
view((_) => {
  _.textInput("Username: ", name);
  _.numberInput("Age: ", age);
  if (_.button<".primary-btn">("Register").as(btn)) {
    table.push(toRaw({ name, age }));
    name.value = "";
    age.value = 0;
  }
  btn.current.disabled = !(name.value.length > 0 && age.value > 0);
  _.table<"{color:red}", (typeof table)[number]>(table, "name", (row) => {
    _.td(() => {
      _.t(row.name);
    });
    _.td(() => {
      _.t(row.age.toString());
    });
  });
});

// `
// p-10 flex flex-col items-center justify-center
//          p-5 bg-gray-100 rounded-lg shadow-2xl
//                      p-5 bg-gray-30 rounded-sm

//           p-5 bg-gray-100 rounded-lg shadow-2xl

//                                             red

//                                           green

// `
