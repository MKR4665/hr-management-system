import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { Toaster } from '../presentation/components/ui/toast';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AppRoutes />
    </BrowserRouter>
  );
}
