import AppRoutes from "./routes";
import { supabase } from '../lib/supabaseClient';

supabase.auth.getSession().then(() => console.log("Connection Successfull")).catch(err => console.error("Connection error:", err));

function App() {
  return <>
  <AppRoutes />
  </>;
}

export default App;
