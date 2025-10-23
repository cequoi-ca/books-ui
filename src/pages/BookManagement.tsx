import adapter from 'adapter';
import PageWrapper from '../components/page_wrapper';
import InitialMutableBookList from '../components/initial_mutable_book_list';

const routes = { "Home": "/", "Manage Books": "/manage", "Warehouse": "/warehouse" };

/**
 * Book Management Page
 * Admin page for creating, editing, and deleting books in the catalog
 */
export default function BookManagement() {
  return (
    <PageWrapper title="Manage Books" routes={routes}>
      <InitialMutableBookList
        listBooks={adapter.listBooks}
        createOrUpdateBook={adapter.createOrUpdateBook}
        removeBook={adapter.removeBook}
      />
    </PageWrapper>
  );
}
