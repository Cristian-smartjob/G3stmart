"use client";

import { SelectorItem } from "@/interface/ui";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";

interface Props {
  title: string;
  items: SelectorItem[];
  isLoading?: boolean;
  onChange: (selectedItems: SelectorItem[]) => void;
  value?: SelectorItem[];
  placeholder?: string;
}

export default function MultipleSelector({
  title,
  items,
  isLoading = false,
  onChange,
  value = [],
  placeholder = "Seleccionar...",
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectorItem[]>(value);

  // Actualizar el estado local cuando el prop value cambie
  useEffect(() => {
    setSelectedItems(value);
  }, [value]);

  const filteredItems =
    query === ""
      ? items.filter((item) => !selectedItems.some((selected) => selected.id === item.id))
      : items.filter((item) => {
          return (
            item.label.toLowerCase().includes(query.toLowerCase()) &&
            !selectedItems.some((selected) => selected.id === item.id)
          );
        });

  const handleSelect = (item: SelectorItem) => {
    const newSelectedItems = [...selectedItems, item];
    setSelectedItems(newSelectedItems);
    onChange(newSelectedItems);
    setQuery("");
  };

  const handleRemove = (itemToRemove: SelectorItem) => {
    const newSelectedItems = selectedItems.filter((item) => item.id !== itemToRemove.id);
    setSelectedItems(newSelectedItems);
    onChange(newSelectedItems);
  };

  return (
    <div className="space-y-3">
      <Combobox as="div" value={null} onChange={(item: SelectorItem | null) => item && handleSelect(item)}>
        <div className="flex gap-x-2 items-center">
          <Label className="block text-sm/6 font-medium text-gray-900">{title}</Label>
          {isLoading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Cargando...</span>
            </div>
          ) : null}
        </div>

        <div className="relative mt-2">
          <ComboboxInput
            className="block w-full rounded-md bg-white py-1.5 pl-3 pr-12 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => setQuery("")}
            placeholder={placeholder}
            value={query}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>

          {filteredItems.length > 0 && (
            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredItems.map((item) => (
                <ComboboxOption
                  key={item.id}
                  value={item}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                >
                  <span className="block truncate">{item.label}</span>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}
        </div>
      </Combobox>

      {/* Chips de elementos seleccionados */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="inline-flex items-center gap-x-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
            >
              <span>{item.label}</span>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-indigo-600/20"
              >
                <span className="sr-only">Remover {item.label}</span>
                <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
