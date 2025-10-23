/**
 * Unified Ecommerce Adapter Type Definitions
 * Consolidates all types from assignments 1-4 into a single cohesive API
 */

// Base Types
export type BookID = string;
export type ShelfId = string;
export type OrderId = string;

/**
 * Book entity representing a product in the catalog
 */
export interface Book {
  id?: BookID;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

/**
 * Filter criteria for searching books
 * Multiple filters use OR logic - a book matching any filter is returned
 * Within a single filter, all conditions must match (AND logic)
 */
export interface Filter {
  from?: number;      // Minimum price (inclusive)
  to?: number;        // Maximum price (inclusive)
  name?: string;      // Book name (partial match, case-insensitive)
  author?: string;    // Author name (partial match, case-insensitive)
}

/**
 * Location of books on a warehouse shelf
 */
export interface ShelfLocation {
  shelf: ShelfId;
  count: number;
}

/**
 * Customer order containing books and quantities
 */
export interface Order {
  orderId: OrderId;
  books: Record<BookID, number>;  // BookID -> quantity
}

/**
 * Order fulfillment details for warehouse operations
 */
export interface OrderFulfillment {
  book: BookID;
  shelf: ShelfId;
  numberOfBooks: number;
}

/**
 * Response type for order creation that may indicate missing inventory
 */
export type OrderResponse =
  | { orderId: OrderId }
  | { missingBooks: Array<{ book: BookID; numberAvailable: number; numberRequested: number }> };

/**
 * Unified Ecommerce Adapter Interface
 * Provides all functionality for a complete ecommerce bookstore
 */
export interface EcommerceAdapter {
  // ============================================
  // Catalog Management (Public)
  // ============================================

  /**
   * List all books with optional filtering
   * @param filters - Optional array of filter criteria (OR logic between filters)
   * @returns Promise resolving to array of books
   */
  listBooks(filters?: Filter[]): Promise<Book[]>;

  /**
   * Get a single book by its ID
   * @param bookId - The unique identifier of the book
   * @returns Promise resolving to the book
   * @throws Error if book not found
   */
  lookupBookById(bookId: BookID): Promise<Book>;

  // ============================================
  // Book CRUD (Admin)
  // ============================================

  /**
   * Create a new book or update an existing one
   * @param book - Book data (with or without ID)
   * @returns Promise resolving to the book ID
   */
  createOrUpdateBook(book: Book): Promise<BookID>;

  /**
   * Remove a book from the catalog
   * @param bookId - The unique identifier of the book to remove
   * @returns Promise resolving when book is removed
   */
  removeBook(bookId: BookID): Promise<void>;

  // ============================================
  // Inventory Management (Warehouse)
  // ============================================

  /**
   * Add books to a warehouse shelf
   * @param bookId - The book to stock
   * @param numberOfBooks - Quantity to add
   * @param shelf - Shelf location identifier
   * @returns Promise resolving when books are placed
   */
  placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelf: ShelfId): Promise<void>;

  /**
   * Find all shelf locations where a book is stocked
   * @param bookId - The book to locate
   * @returns Promise resolving to array of shelf locations with counts
   */
  findBookOnShelf(bookId: BookID): Promise<ShelfLocation[]>;

  // ============================================
  // Customer Orders
  // ============================================

  /**
   * Create a new customer order
   * @param order - Array of book IDs (duplicates indicate quantity)
   * @returns Promise resolving to order ID or missing inventory details
   */
  orderBooks(order: BookID[]): Promise<{ orderId: OrderId }>;

  /**
   * List all pending orders
   * @returns Promise resolving to array of orders
   */
  listOrders(): Promise<Order[]>;

  // ============================================
  // Order Fulfillment (Warehouse)
  // ============================================

  /**
   * Fulfill an order by picking books from shelves
   * @param orderId - The order to fulfill
   * @param booksFulfilled - Details of which books to take from which shelves
   * @returns Promise resolving when order is fulfilled
   * @throws Error if fulfillment fails (e.g., insufficient inventory)
   */
  fulfilOrder(orderId: OrderId, booksFulfilled: OrderFulfillment[]): Promise<void>;
}
