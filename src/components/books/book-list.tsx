import { component$, useComputed$ } from "@builder.io/qwik";
import { getBooks } from "~/services/booksService";
import { Grid } from "~/styled-system/jsx";
import { BookListItem } from "./book-list-item";

export const BookList = component$(() => {
  const books = useComputed$(async () => {
    return await getBooks();
  });
  return (
    <Grid>
      {books.value.map((item) => (
        <BookListItem
          key={item.ISBN}
          title={item.title}
          description={item.synopsis}
          imageUrl={item.cover}
        />
      ))}
    </Grid>
  );
});
