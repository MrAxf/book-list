import type { CSSProperties, QRL, Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { HStack, VStack, styled } from "~/styled-system/jsx";
import SelectInput from "../forms/select-input";
import { FavButton } from "../fav-button";

interface BookFavIndicator {
  isBookInMyList: Signal<boolean>;
  readPriority: Readonly<Signal<1 | 3 | 2>>;
  onInput: QRL<(el: HTMLSelectElement) => void>;
  onFavButtonClick: QRL<() => void>;
  style?: string | CSSProperties
}

export const BookFavIndicator = component$(
  ({
    isBookInMyList,
    readPriority,
    onInput,
    onFavButtonClick,
    style
  }: BookFavIndicator) => {
    return (
      <HStack
        gap="5"
        w="full"
        minH="68px"
        justifyContent="end"
        alignItems="start"
        style={style}
      >
        {isBookInMyList.value && (
          <VStack flexGrow="1" alignItems="start">
            <styled.label fontSize="xs">Prioridad de lectura:</styled.label>
            <SelectInput
              value={readPriority.value}
              onInput$={(_, el) => {
                onInput(el);
              }}
              onClick$={(ev) => ev.stopPropagation()}
              w="full"
            >
              <option value={3} selected>
                Alta
              </option>
              <option value={2} selected>
                Media
              </option>
              <option value={1} selected>
                Baja
              </option>
            </SelectInput>
          </VStack>
        )}
        <FavButton
          onClick={onFavButtonClick}
          filled={isBookInMyList.value}
          title={
            isBookInMyList.value ? "Quitar de mi lista" : "Añadir a mi lista"
          }
        />
      </HStack>
    );
  }
);