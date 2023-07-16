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
} from "@builder.io/qwik";
import useBooksInList from "~/hooks/useBooksInList";
import { filterBooks, getBooks } from "~/services/booksService";
import type { Book, BooksFilter, BooksInMyList } from "~/types/books";

interface BookContextType {
  books: Readonly<Signal<Book[]>>;
  booksInMyList: Signal<BooksInMyList>;
  genres: string[];
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

  useContextProvider(BooksContenxt, {
    books,
    booksInMyList,
    genres,
  });
  return (
    <>
      <Slot />
    </>
  );
});

export function useBooks(initialFilters: BooksFilter) {
  const { booksInMyList, genres } = useContext(BooksContenxt);
  const filters = useStore<BooksFilter>({
    genre: "none",
    minPages: 0,
    ...initialFilters,
  });
  const filteredBooks = useComputed$(() =>
    filterBooks(filters, booksInMyList.value)
  );

  return {
    books: filteredBooks,
    filters,
    genres,
  };
}

export function useBook(book: Book) {
  const { booksInMyList } = useContext(BooksContenxt);

  const readPriority = useComputed$(() => booksInMyList.value[book.ISBN]);

  const isBookInMyList = useComputed$(() => {
    return Boolean(booksInMyList.value[book.ISBN])
  }
  );

  const addBookToMyList = $(() => {
    booksInMyList.value = { ...booksInMyList.value, [book.ISBN]: 2 };
  });

  const deleteBookFromMyList = $(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [book.ISBN]: removeIdtem, ...rest } = booksInMyList.value;
    booksInMyList.value = rest;
  });

  const toogleFromMyList = $(() => {
    if (!isBookInMyList.value) addBookToMyList();
    else deleteBookFromMyList();
  });

  const setReadPriority = $((value: 1 | 2 | 3) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (isBookInMyList.value)
      booksInMyList.value = { ...booksInMyList.value, [book.ISBN]: value };
  });
  return {
    isBookInMyList,
    toogleFromMyList,
    readPriority,
    setReadPriority,
  };
}
