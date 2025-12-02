import { Key } from "@solid-primitives/keyed";
import { Book, BookID } from "ecommerce_adapter";
import { createResource, createSignal } from "solid-js";

interface Props {
    listBooks: (filters: Array<{from?: number, to?: number}>) => Promise<Book[]>,
    createOrUpdateBook: (book: Book) => Promise<BookID>,
    removeBook: (book: BookID) => Promise<void>

}

export default function InitialMutableBookList({ createOrUpdateBook, removeBook, listBooks}: Props) {
    const [new_book, set_new_book] = createSignal<Book>({name: "", author: "", description: "", price: 0, image: ""})
  
    let [books, {mutate: mutate_books, refetch: refetch_books }] = createResource(async () => {
      return await listBooks([]); 
    })
  
    const update_new_book = (ev: Event & ({
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
  } | {
    currentTarget: HTMLTextAreaElement;
    target: HTMLTextAreaElement;
  }), value: keyof Book) => {
        let updated : Book = { ...new_book()};
        if (value === "price") {
          updated.price = Number.parseFloat(ev.target?.value ?? "0");
        } else {
          updated[value] = ev.target.value;
        }
        set_new_book(updated);
    }
  
    const submit_new_book = async ()  => {
      let book = new_book();
      set_new_book({name: "", author: "", description: "", price: 0, image: ""});
      await createOrUpdateBook(book);
      refetch_books();
    }
  
    const update_existing_book = (ev: Event & ({
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
  } | {
    currentTarget: HTMLTextAreaElement;
    target: HTMLTextAreaElement;
  }), value: keyof Book, index: number) => {
    console.log("called update on", value, "at", index);
        mutate_books((original) => {
          console.log("called update with", original)
          if (!original) return original;
          let current_book = original[index];
          if (!current_book) return original;
          let updated_list = [...(original)];
          let updated : Book = { ...current_book};
          if (value === "price") {
            updated.price = Number.parseFloat(ev.target?.value ?? "0");
          } else {
            updated[value] = ev.target.value;
          }
  
          updated_list[index] = updated;

          console.log("Updated from", original[index], "to", updated_list[index]);
  
          return updated_list;
      });
    }
  
    const update_book = async (updated_book: Book)  => {
      console.log("Updated Book: ", updated_book);
      let id = updated_book.id;
      if (!id) {
        throw new Error("Failed to update book");
      }
      let book = books()?.find((book) => book.id === id);
      if (!book) {
        throw new Error("No up to date book");
      }
      
      await createOrUpdateBook(book);
      refetch_books();
    }
  
    const delete_book = async (book: Book) => {
      if (book.id) {
        await removeBook(book.id);
      }
      refetch_books();
    }
  
    return (<>
        <div id="add_book_form" class="flex flex-col dark:bg-slate-800 bg-slate-200 rounded-lg p-10 col-start-1 col-span-1 gap-2 items-start">
          <h2 class="text-xl font-semibold mb-2">Add Book</h2>
          <label for='name' class="font-medium">Name</label>
          <input class='text-black px-2 py-1 rounded border border-gray-300 dark:border-slate-500 w-full' name='name' placeholder='Name' value={new_book().name} onInput={(e) => update_new_book(e, "name")}/>

          <label for='author' class="font-medium">Author</label>
          <input class='text-black px-2 py-1 rounded border border-gray-300 dark:border-slate-500 w-full' name='author' placeholder='Author' value={new_book().author} onInput={(e) => update_new_book(e, "author")}/>

          <label for='image' class="font-medium">Image URL</label>
          <input class='text-black px-2 py-1 rounded border border-gray-300 dark:border-slate-500 w-full' name='image' placeholder='Image URL' value={new_book().image} onInput={(e) => update_new_book(e, "image")}/>

          <label for='price' class="font-medium">Price</label>
          <input class='text-black px-2 py-1 rounded border border-gray-300 dark:border-slate-500 w-full' name='price' type="text" placeholder='0.0' value={new_book().price} onInput={(e) => update_new_book(e, "price")}/>

          <label for='description' class="font-medium">Description</label>
          <textarea class='text-black px-2 py-1 rounded border border-gray-300 dark:border-slate-500 min-h-20 w-full' name="description" placeholder='Description' value={new_book().description} onInput={(e) => update_new_book(e, "description")}/>

          <button name="add_book" class="bg-green-400 hover:bg-green-700 text-white px-4 py-2 rounded mt-2 transition-colors w-full" onclick={() => submit_new_book()}>Add Book</button>
        </div>
        <ul class="flex flex-col col-start-2 p-10 gap-6">
          <Key each={books()} by="id">
            { (item, index) =>
            <li x-book={item().id} x-book-name={item().name} class="book bg-[#734F96] border border-purple-400 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex flex-row gap-6 items-stretch min-h-[280px]">
              {/* Book Image - 80% height */}
              <div class="flex-shrink-0 w-32 flex items-center">
                <div class="w-full h-[80%] bg-purple-300 rounded overflow-hidden">
                  <img src={item().image} class="w-full h-full object-cover" alt={item().name}/>
                </div>
              </div>

              {/* Input Fields Section */}
              <div class="flex-1 grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Name */}
                <div class="flex flex-col">
                  <label class="text-sm text-white mb-1">Name</label>
                  <input x-name="name" class="text-black px-3 py-2 rounded border-none w-full bg-pink-200 placeholder-gray-500" placeholder="Name" value={item().name} onInput={(e) => update_existing_book(e, "name", index())}/>
                </div>

                {/* Description (spans 2 columns) */}
                <div class="flex flex-col row-span-3">
                  <label class="text-sm text-white mb-1">Description</label>
                  <textarea x-name="description" class="text-black px-3 py-2 rounded border-none w-full h-full min-h-32 bg-pink-200 placeholder-gray-500 resize-none" placeholder="Description" value={item().description} onInput={(e) => update_existing_book(e, "description", index())}/>
                </div>

                {/* Author */}
                <div class="flex flex-col">
                  <label class="text-sm text-white mb-1">Author</label>
                  <input x-name="author" class="text-black px-3 py-2 rounded border-none w-full bg-pink-200 placeholder-gray-500" placeholder="Author" value={item().author} onInput={(e) => update_existing_book(e, "author", index())}/>
                </div>

                {/* Price */}
                <div class="flex flex-col">
                  <label class="text-sm text-white mb-1">Price</label>
                  <input x-name="price" class="text-black px-3 py-2 rounded border-none w-full bg-pink-200 placeholder-gray-500" placeholder="0.0" value={item().price} type="text" onInput={(e) => update_existing_book(e, "price", index())}/>
                </div>

                {/* Image URL - moved below Description */}
                <div class="flex flex-col row-start-4 col-span-2">
                  <label class="text-sm text-white mb-1">Image URL</label>
                  <input x-name="image" class="text-black px-3 py-2 rounded border-none w-full bg-pink-200 placeholder-gray-500" placeholder="Image URL" value={item().image} onInput={(e) => update_existing_book(e, "image", index())}/>
                </div>
              </div>

              {/* Action Buttons - positioned at bottom */}
              <div class="flex flex-col gap-3 flex-shrink-0 justify-end">
                <button x-name="update" class="bg-green-400 hover:bg-green-500 text-white font-medium px-6 py-2 rounded transition-colors whitespace-nowrap" onclick={() => update_book(item())}>Update Book</button>
                <button x-name="remove" class="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded transition-colors whitespace-nowrap" onclick={() => delete_book(item())}>Delete Book</button>
              </div>
            </li>
            }
          </Key>
        </ul>
        </>
    )
}
