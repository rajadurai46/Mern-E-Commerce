import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import {GoogleOAuthProvider} from '@react-oauth/google';
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./styles/theme.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>

      <AuthProvider>
      
          <Provider store={store}>
            <GoogleOAuthProvider clientId="540303976203-jojoblqurmbr9q1bd64mrs9415bm1p3g.apps.googleusercontent.com">
        <App />
        </GoogleOAuthProvider>
        </Provider>
      
      </AuthProvider>
  
  </BrowserRouter>
);
