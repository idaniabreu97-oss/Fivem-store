import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreLayout } from "@/components/layout/store-layout";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import ScriptsPage from "@/pages/scripts";
import ScriptDetailPage from "@/pages/script-detail";
import CartPage from "@/pages/cart";
import OrderConfirmationPage from "@/pages/order-confirmation";
import AdminDashboard from "@/pages/admin/index";
import AdminScriptsPage from "@/pages/admin/scripts";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminCategoriesPage from "@/pages/admin/categories";

const queryClient = new QueryClient();

function StoreRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/scripts" component={ScriptsPage} />
      <Route path="/scripts/:id" component={ScriptDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/orders/:id" component={OrderConfirmationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/scripts" component={AdminScriptsPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/categories" component={AdminCategoriesPage} />
    </Switch>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" nest>
        <AdminRouter />
      </Route>
      <Route>
        <StoreLayout>
          <StoreRouter />
        </StoreLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
