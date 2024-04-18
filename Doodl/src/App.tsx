import Public from "./components/public"
import Private from "./components/private"

import useAuth from "./hooks/auth"
import 'bootstrap-icons/font/bootstrap-icons.css'

function App(): JSX.Element {
  const isLogin = useAuth();
  

  return isLogin ? <Private /> : <Public />;
}

export default App;
