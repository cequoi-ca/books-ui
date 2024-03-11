declare module "adapter" {
    export interface Book {
        name: string,
        author: string,
        description: string,
        price: number,
        image: string,
    };

    type default_export = {
        assignment: "assignment-1",
        listBooks: (filters?: Array<{from?: number, to?: number}>) => Promise<Book[]>
    } | {
        assignment: "assignment-2"
    };

    const ex: default_export;

    export default ex;
}