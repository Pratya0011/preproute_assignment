import "./App.scss";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./_store/store";
import { SnackbarProvider } from "notistack";
import Loader from "./Components/Loader";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Loader />
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          style={{ fontFamily: "sans-serif" }}
          autoHideDuration={1500}
        >
          <RouterProvider router={router} />
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
