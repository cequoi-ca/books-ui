import { Route, Router } from '@solidjs/router';
import Storefront from './pages/Storefront';
import BookManagement from './pages/BookManagement';
import Warehouse from './pages/Warehouse';

/**
 * Main Application Component
 * Unified ecommerce bookstore with three main pages:
 * - Storefront: Customer-facing shopping experience
 * - Book Management: Admin CRUD operations for catalog
 * - Warehouse: Inventory management and order fulfillment
 */
function App() {
  return (
    <Router>
      <Route path="/" component={Storefront} />
      <Route path="/manage" component={BookManagement} />
      <Route path="/warehouse" component={Warehouse} />
    </Router>
  );
}

export default App;

