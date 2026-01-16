import AppRoutes from "./routes";
import { supabase } from '../lib/supabaseClient';

supabase.auth.getSession().then(console.log("Connection Successfull"));

function App() {
  return <>
  <AppRoutes />
  </>;
}

export default App;
