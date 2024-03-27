declare module "assignment_1" {
    export interface Book {
        name: string,
        author: string,
        description: string,
        price: number,
        image: string,
    };

    export function listBooks(filters?: Array<{ from?: number, to?: number }>): Promise<Book[]>;

    export const assignment = "assignment-1";

    export default {
        listBooks,
        assignment
    }
}

declare module "assignment_2" {
    export type BookID = string;

    export interface Book {
        id?: BookID,
        name: string,
        author: string,
        description: string,
        price: number,
        image: string,
    };

    export function listBooks(filters?: Array<{ from?: number, to?: number }>): Promise<Book[]>;

    export function createOrUpdateBook(book: Book): Promise<BookID>;

    export function removeBook(book: BookID): Promise<void>;

    export const assignment = "assignment-2";

    export default {
        listBooks,
        createOrUpdateBook,
        removeBook,
        assignment
    }
}

declare module "assignment_3" {
    export type BookID = string;

    export interface Book {
        id?: BookID,
        name: string,
        author: string,
        description: string,
        price: number,
        image: string,
    };

    export interface Filter {
        from?: number,
        to?: number,
        name?: string,
        author?: string,
    };

    export function listBooks(filters?: Array<Filter>): Promise<Book[]>;

    export function createOrUpdateBook(book: Book): Promise<BookID>;

    export function removeBook(book: BookID): Promise<void>;

    export const assignment = "assignment-3";

    export default {
        listBooks,
        createOrUpdateBook,
        removeBook,
        assignment
    }
}

declare module "assignment_4" {
    export type BookID = string;

    export interface Book {
        id?: BookID,
        name: string,
        author: string,
        description: string,
        price: number,
        image: string,
    };

    export interface Filter {
        from?: number,
        to?: number,
        name?: string,
        author?: string,
    };

    export function listBooks(filters?: Array<Filter>): Promise<Book[]>;

    export function createOrUpdateBook(book: Book): Promise<BookID>;

    export function removeBook(book: BookID): Promise<void>;

    export function lookupBookById(book: BookID): Promise<Book>;

    export type ShelfId = string
    export type OrderId = string

    export function placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelf: ShelfId): Promise<void>;

    export function bookAvailability(bookId: BookID): Promise<number>;

    export function orderBooks(order: BookID[]): Promise<{ orderId: OrderId } | { missingBooks: Array<{ book: BookID, numberAvailable: number, numberRequested: number }> }>;

    export function findBookOnShelf(book: BookID):  Promise<Array<{ shelf: ShelfId, count: number }>> ;

    export function fulfilOrder(order: OrderId, booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>): Promise<void>;

    export function listOrders(): Promise<Array<{ orderId: OrderId, books: BookID[] }>>;

    export const assignment = "assignment-4";

    export default {
        listBooks,
        createOrUpdateBook,
        removeBook,
        assignment,
        placeBooksOnShelf,
        bookAvailability,
        orderBooks,
        findBookOnShelf,
        fulfilOrder,
        listOrders,
        lookupBookById
    }
}

declare module "adapter" {
    import assignment_1 from "assignment_1";
    import assignment_2 from "assignment_2";
    import assignment_3 from "assignment_3";
    import assignment_4 from "assignment_4";

    type default_export = assignment_1 | assignment_2 | assignment_3 | assignment_4;

    const ex: default_export;

    export default ex;
}