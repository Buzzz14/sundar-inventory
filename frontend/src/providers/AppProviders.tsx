import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/contexts/UserContext";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <UserProvider>{children}</UserProvider>
      </BrowserRouter>
      <Toaster />
    </Provider>
  );
};

export default AppProviders;
