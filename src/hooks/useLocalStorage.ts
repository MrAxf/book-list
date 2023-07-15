import { useSignal, useVisibleTask$ } from "@builder.io/qwik";

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const data = useSignal(initialValue);

  useVisibleTask$(({ cleanup }) => {
    function sync(ev: StorageEvent) {
      if (ev.key === key) {
        const storedValue = localStorage.getItem(key);
        if(storedValue) data.value = JSON.parse(storedValue)
      }
    }
    window.addEventListener("storage", sync);
    cleanup(() => {
        window.removeEventListener("storage", sync)
    })
  });

  useVisibleTask$(({ track }) => {
    track(() => data.value)
    localStorage.setItem(key, JSON.stringify(data.value));
  })

  return data
};

export default useLocalStorage