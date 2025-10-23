/**
 * Unified Ecommerce Adapter Type Definitions
 * Consolidates all functionality from assignments 1-4 into a single cohesive API
 */

declare module "ecommerce_adapter" {
    // Base Types
    export type BookID = string;
    export type ShelfId = string;
    export type OrderId = string;

    // Book entity
    export interface Book {
        id?: BookID;
        name: string;
        author: string;
        description: string;
        price: number;
        image: string;
    }

    // Filter criteria
    export interface Filter {
        from?: number;
        to?: number;
        name?: string;
        author?: string;
    }

    // Warehouse shelf location
    export interface ShelfLocation {
        shelf: ShelfId;
        count: number;
    }

    // Customer order
    export interface Order {
        orderId: OrderId;
        books: Record<BookID, number>;
    }

    // Order fulfillment details
    export interface OrderFulfillment {
        book: BookID;
        shelf: ShelfId;
        numberOfBooks: number;
    }

    // Catalog Management
    export function listBooks(filters?: Array<Filter>): Promise<Book[]>;
    export function lookupBookById(bookId: BookID): Promise<Book>;

    // Book CRUD (Admin)
    export function createOrUpdateBook(book: Book): Promise<BookID>;
    export function removeBook(bookId: BookID): Promise<void>;

    // Inventory Management (Warehouse)
    export function placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelf: ShelfId): Promise<void>;
    export function findBookOnShelf(bookId: BookID): Promise<Array<ShelfLocation>>;

    // Customer Orders
    export function orderBooks(order: BookID[]): Promise<{ orderId: OrderId }>;
    export function listOrders(): Promise<Array<Order>>;

    // Order Fulfillment
    export function fulfilOrder(orderId: OrderId, booksFulfilled: Array<OrderFulfillment>): Promise<void>;

    export default {
        listBooks,
        lookupBookById,
        createOrUpdateBook,
        removeBook,
        placeBooksOnShelf,
        findBookOnShelf,
        orderBooks,
        listOrders,
        fulfilOrder
    }
}

// Legacy assignments for backward compatibility during migration
declare module "assignment_1" {
    import ecommerceAdapter from "ecommerce_adapter";
    export default ecommerceAdapter;
}

declare module "assignment_2" {
    import ecommerceAdapter from "ecommerce_adapter";
    export default ecommerceAdapter;
}

declare module "assignment_3" {
    import ecommerceAdapter from "ecommerce_adapter";
    export default ecommerceAdapter;
}

declare module "assignment_4" {
    import ecommerceAdapter from "ecommerce_adapter";
    export default ecommerceAdapter;
}

declare module "adapter" {
    import ecommerceAdapter from "ecommerce_adapter";
    export default ecommerceAdapter;
}