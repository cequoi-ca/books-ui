export async function listBooks(filters) {
    let books = [
        {
            name: "A Book",
            description: "some book...",
            price: 20.4,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmQs8xbIseku59onHMpZ6bQ3XaeaSjeLgzMQ&usqp=CAU"
        },
        {
            name: "Another Book",
            description: "some book...",
            price: 5.4,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmQs8xbIseku59onHMpZ6bQ3XaeaSjeLgzMQ&usqp=CAU"
        },
        {
            name: "Another Third Book",
            description: "some book...",
            price: 15.4,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmQs8xbIseku59onHMpZ6bQ3XaeaSjeLgzMQ&usqp=CAU"
        },
    ];

    let filtered = filters && filters.length > 0 ? books.filter((value) => {
        for (let filter of filters) {
            let min = filter.from ?? 0;
            let max = filter.to ?? 10000000;

            if (value.price < max && value.price > min) {
                return true;
            }
        }
        return false;
    }) : books;

    return filtered;
}