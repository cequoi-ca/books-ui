import adapter from 'adapter';
import PageWrapper from '../components/page_wrapper';
import InitialWarehouseShipmentArrived from '../components/initial_warehouse_shipment_arrived';
import InitialOrderList from '../components/initial_order_list';

const routes = { "Home": "/", "Manage Books": "/manage", "Warehouse": "/warehouse" };

/**
 * Warehouse Page
 * Warehouse operations for receiving shipments and fulfilling customer orders
 */
export default function Warehouse() {
  return (
    <PageWrapper title="Warehouse" routes={routes}>
      <div class="grid grid-cols-[1fr_2px_1fr] justify-center items-start col-start-2 gap-2 p-4">
        <InitialWarehouseShipmentArrived
          listBooks={adapter.listBooks}
          placeBooksOnShelf={adapter.placeBooksOnShelf}
        />
        <div class="w-full h-full bg-slate-800"/>
        <InitialOrderList
          lookupBookById={adapter.lookupBookById}
          listOrders={adapter.listOrders}
          findBookOnShelf={adapter.findBookOnShelf}
          fulfilOrder={adapter.fulfilOrder}
        />
      </div>
    </PageWrapper>
  );
}
