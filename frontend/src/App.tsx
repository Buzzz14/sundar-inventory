import AppRoutes from "@/routes";
import AppProviders from "@/providers/AppProviders";

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
