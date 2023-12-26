# experimental-webapp

Experimental webapp framework.

# [Archieved]

**Please go to [Refina.js](https://github.com/refinajs/)**

## Features

- 合并的前后端逻辑
  e.g.`@click`可以直接调用数据库

```tsx
import { weatherDb } from "./db";

export default (
  <DbTable
    db={weatherDb}
    columns={["id", "city", "temperature", "humidity", "wind"]}
  />
);
```

```tsx
import { usersDb, loginDb } from "./db";

export default () => {
  let username: "";
  @sendBackBy.md5
  let password: "";
  <label> Username <input type="text" value="username"/> </label>
  <label> Password <input type="password" value="password"/> </label>
  if(<button> Login! </button>){
    let user = loginDb.select(username, password);
    if (user) {
      loginDb.insert(user.id, global.sessionId);
      alert("Login success!");
    } else {
      alert("Wrong username or password!");
    }
  }
};
```


```typescript
export default () => {
  let n = 0;
  <div>
    <button @click={n++}> Click me! </button>
    <p> You clicked {n} times </p>
  </div>
};
```
