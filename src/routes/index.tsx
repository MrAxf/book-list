import { component$ } from "@builder.io/qwik";
import { BookList } from "~/components/books/book-list";
import { BookListItem } from "~/components/books/book-list-item";

export default component$(() => {
  return (
    <div>
      <BookList
      />
    </div>
  );
});
