"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";

export interface TagOption {
  id: string;
  label: string;
}

interface TagSearchInputProps {
  label?: string;
  placeholder?: string;
  options: TagOption[];
  selected: TagOption[];
  onAdd: (option: TagOption) => void;
  onSearch?: (val: string) => void;
  onRemove: (id: string) => void;
}

export default function TagSearchInput({
  label,
  placeholder = "Search...",
  options,
  selected,
  onAdd,
  onRemove,
  onSearch
}: TagSearchInputProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIds = new Set(selected.map((s) => s.id));
  const filtered = options.filter(
    (o) => !selectedIds.has(o.id) && o.label.toLowerCase().includes(query.toLowerCase())
  );

  // close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // reset highlight when filtered list changes
  useEffect(() => { setHighlightedIndex(0); }, [filtered.length]);

  function addOption(option: TagOption) {
    onAdd(option);
    setQuery("");
    setHighlightedIndex(0);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      addOption(filtered[highlightedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="md:col-span-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              {item.label}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="hover:text-blue-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div ref={containerRef} className="relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setOpen(true);
            if (onSearch) {
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => onSearch(val), 300);
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />

        {/* Dropdown */}
        {open && filtered.length > 0 && (
          <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filtered.map((option, index) => (
              <li
                key={option.id}
                onMouseDown={() => addOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                  index === highlightedIndex ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}

        {open && query.length > 0 && filtered.length === 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-400">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}
