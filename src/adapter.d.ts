declare module "assignment_1" {
    export interface Book {
        name: string,
        author: string,
        description: string,
        price: number,
        image: string,
    };

    export function listBooks(filters?: Array<{from?: number, to?: number}>): Promise<Book[]>;

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

    export function listBooks(filters?: Array<{from?: number, to?: number}>): Promise<Book[]>;

    export function createOrUpdateBook(book: Book): Promise<BookID> ;
    
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

    export function createOrUpdateBook(book: Book): Promise<BookID> ;
    
    export function removeBook(book: BookID): Promise<void>;

    export const assignment = "assignment-3";

    export default {
        listBooks,
        createOrUpdateBook,
        removeBook,
        assignment
    }
}

declare module "adapter" {
    import assignment_1 from "assignment_1";
    import assignment_2 from "assignment_2";
    import assignment_3 from "assignment_3";

    type default_export = assignment_1 | assignment_2 | assignment_3;

    const ex: default_export;

    export default ex;
}