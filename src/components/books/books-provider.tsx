import type { Signal } from "@builder.io/qwik";
import {
  $,
  Slot,
  component$,
  createContextId,
  useComputed$,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import useBooksInList from "~/hooks/useBooksInList";
import { filterBooks, getBooks } from "~/services/booksService";
import type { Book, BooksFilter } from "~/types/books";

interface BookContextType {
  books: Readonly<Signal<Book[]>>;
  booksInMyList: Signal<string[]>;
  genres: string[]
}

export const BooksContenxt = createContextId<BookContextType>("books-constext");

export const BooksProvider = component$(() => {
  const books = useSignal(getBooks());
  const booksInMyList = useBooksInList();
  const genres = Array.from(
    books.value.reduce((acc: Set<string>, item) => {
      acc.add(item.genre);
      return acc;
    }, new Set<string>())
  );

  useVisibleTask$(() => {
    const booksInMyListLS = localStorage.getItem("books-in-my-list");
    booksInMyList.value = booksInMyListLS ? JSON.parse(booksInMyListLS) : [];
  });

  useContextProvider(BooksContenxt, {
    books,
    booksInMyList,
    genres
  });
  return (
    <>
      <Slot />
    </>
  );
});

export function useBooks(initialFilters: BooksFilter) {
  const { booksInMyList, genres } = useContext(BooksContenxt);
  const filters = useStore<BooksFilter>(initialFilters);
  const filteredBooks = useComputed$(() =>
    filterBooks(filters, booksInMyList.value)
  );

  return {
    books: filteredBooks,
    filters,
    genres
  };
}

export function useBook(book: Book) {
  const { booksInMyList } = useContext(BooksContenxt);

  const isBookInMyList = useComputed$(() =>
    booksInMyList.value.includes(book.ISBN)
  );

  const addBookToMyList = $(() => {
    booksInMyList.value = [...booksInMyList.value, book.ISBN];
    localStorage.setItem(
      "books-in-my-list",
      JSON.stringify(booksInMyList.value)
    );
  });

  const deleteBookFromMyList = $(() => {
    booksInMyList.value = booksInMyList.value.filter(
      (item) => item !== book.ISBN
    );
    localStorage.setItem(
      "books-in-my-list",
      JSON.stringify(booksInMyList.value)
    );
  });

  const toogleFromMyList = $(() => {
    if (!isBookInMyList.value) addBookToMyList();
    else deleteBookFromMyList();
  });
  return {
    isBookInMyList,
    toogleFromMyList,
  };
}
