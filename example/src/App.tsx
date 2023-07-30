export default {
  html: (
    <>
      <form>
        <div>
          Username
          <input type="text" value="admin" />
        </div>
        <div>
          Password
          <input type="password" value="123456" />
        </div>
        <button
          onClick={doLogin}
        >Submit</button>
      </form>
    </>
  ),
  
}










function doLogin() {
  console.log('doLogin');
}

function App() {

  return (
    <>
      <form>
        <div>
          Username
          <input type="text" value="admin" />
        </div>
        <div>
          Password
          <input type="password" value="123456" />
        </div>
        <button
          onClick={doLogin}
        >Submit</button>
      </form>
    </>
  );
}