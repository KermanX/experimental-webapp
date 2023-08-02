import { d, ref, view, ButtonElement, toRaw } from "./lib.js";

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

let name = d("");
let age = d(0);
let table = d([
  { name: "John", age: 20 },
  { name: "Mary", age: 30 },
  { name: "Bob", age: 40 },
]);
let btn = ref<ButtonElement>();
view((_) => {
  _.textInput("Username: ", name);
  _.numberInput("Age: ", age);
  if (_.button<".primary-btn">("Register").as(btn)) {
    table.value.push(toRaw({ name, age }));
    name.value = "";
    age.value = 0;
  }
  btn.current.disabled = !(name.value.length > 0 && age.value > 0);
  _.table(table, (row) => [
    row.name,
    () => {
      _.td(() => {
        _.t(row.name);
      });
      _.td(() => {
        _.t(row.age);
      });
    },
  ]);
});
