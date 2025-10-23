import { createSignal } from 'solid-js';
import adapter from 'adapter';
import { BookID, Filter } from 'ecommerce_adapter';
import PageWrapper from '../components/page_wrapper';
import RobustFilters from '../components/robust_filters';
import InitialBookList from '../components/initial_book_list';
import InitialShoppingCart from '../components/initial_shopping_cart';

const routes = { "Home": "/", "Manage Books": "/manage", "Warehouse": "/warehouse" };

/**
 * Storefront Page
 * Customer-facing page for browsing books, filtering, and placing orders
 */
export default function Storefront() {
  let [filters, setFilters] = createSignal<Filter[]>([]);

  let [currentOrder, setCurrentOrder] = createSignal<Record<BookID, number>>({});
  let [orderStatus, setOrderStatus] = createSignal<boolean | string>(false);

  const addToOrder = (id: BookID) => {
    let current = currentOrder();
    console.log("Adding", id, current);
    if (id.length === 0) {
      return;
    }
    let nextOrder = {...current};
    nextOrder[id] = (nextOrder[id] || 0) + 1;
    console.log("New Order", nextOrder);
    setCurrentOrder(nextOrder);
    setOrderStatus(false);
  };

  const removeFromOrder = (id: BookID) => {
    let current = currentOrder();
    console.log("Removing", id, current);
    if (id.length === 0) {
      return;
    }
    let nextOrder = {...current};
    nextOrder[id] = (nextOrder[id] || 0) - 1;
    if (nextOrder[id] <= 0) {
      delete nextOrder[id];
    }
    console.log("New Order", nextOrder);
    setCurrentOrder(nextOrder);
  };

  const submitOrder = async () => {
    let current = currentOrder();
    let order = Object.keys(current).flatMap((key) => {
      let count = current[key];
      let result = []
      for (let i = 0; i < count; i++) {
        result.push(key)
      }
      return result
    });
    try {
      await adapter.orderBooks(order);
      setCurrentOrder({});
      setOrderStatus(true);
    } catch (e) {
      console.error(e);
      setOrderStatus(`Error with order: ${e}`);
    }
  };

  return (
    <PageWrapper title="Shop" routes={routes}>
      <RobustFilters filters={filters} setFilters={(filters) => {
        console.log("Setting filters", filters);
        setFilters(filters)
      }} />
      <InitialBookList filters={filters} listBooks={adapter.listBooks} addToOrder={addToOrder}/>
      <InitialShoppingCart
        orderStatus={orderStatus}
        lookupBookById={adapter.lookupBookById}
        addToOrder={addToOrder}
        removeFromOrder={removeFromOrder}
        currentOrder={currentOrder}
        submitOrder={submitOrder}
      />
    </PageWrapper>
  );
}
