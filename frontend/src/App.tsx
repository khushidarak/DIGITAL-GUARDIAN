import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CustomCursor from "@/components/CustomCursor";
import Index from "./pages/Index.tsx";
import EmailPage from "./pages/EmailPage.tsx";
import TransactionPage from "./pages/TransactionPage.tsx";
import CallPage from "./pages/CallPage.tsx";
import UrlPage from "./pages/UrlPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import BackendStatus from "@/components/BackendStatus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <CustomCursor />
      <BackendStatus />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/email" element={<EmailPage />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/call" element={<CallPage />} />
          <Route path="/url" element={<UrlPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
