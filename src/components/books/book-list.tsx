import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Grid, HStack, VStack } from "~/styled-system/jsx";
import { BookListItem } from "./book-list-item";
import { useBooks } from "./books-provider";

interface BookListProps {
  isInMyList?: boolean;
}

export const BookList = component$<BookListProps>(({ isInMyList = false }) => {
  const { books, filters, genres } = useBooks({
    isInMyList,
  });

  const searchText = useSignal("");

  useTask$(({ track, cleanup }) => {
    track(() => searchText.value);

    const debounced = setTimeout(() => {
      if (searchText.value.replace(" ", "").length >= 3)
        filters.searchText = searchText.value;
        else filters.searchText = undefined
    }, 300);

    cleanup(() => clearTimeout(debounced));
  });

  return (
    <VStack>
      <HStack>
        <select
          name="filter-genre"
          value={filters.genre}
          onInput$={(_, el) => (filters.genre = el.value)}
        >
          <option value={""} selected>
            No Filtrar
          </option>
          {genres.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="range"
          min={0}
          max={1000}
          step={100}
          value={filters.minPages || 0}
          onInput$={(_, el) => (filters.minPages = Number(el.value))}
        />
        {filters.minPages}
        <input type="search" bind:value={searchText} />
      </HStack>
      <Grid>
        {books.value.map((item) => (
          <BookListItem key={item.ISBN} book={item} />
        ))}
      </Grid>
    </VStack>
  );
});
