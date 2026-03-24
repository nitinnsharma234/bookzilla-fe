import React from 'react'
import Select, { SingleValue } from 'react-select';
import countries from 'world-countries'

export interface CountryOption {
  value: string;
  label: string;
  flag: string;
}

// ✅ Typed as CountryOption[]
const countryOptions: CountryOption[] = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
}));

interface CountrySelectProps {
  onChange: (selected: SingleValue<CountryOption>) => void;
  value?: SingleValue<CountryOption>;
}

const formatOptionLabel = ({ label, flag }: CountryOption) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span>{flag}</span>
    <span>{label}</span>
  </div>
);

const CountryDropDown = ({ onChange, value }: CountrySelectProps) => {
  return (
    <Select<CountryOption>                    // ✅ generic type passed
      unstyled
      isClearable                             // ✅ shows × to clear selection
      value={value}                           // ✅ THIS WAS MISSING
      options={countryOptions}
      formatOptionLabel={formatOptionLabel}
      placeholder="Nationality"
      onChange={(selected) => onChange(selected)}
      classNames={{
        
        control: ({ isFocused }) =>
          `border rounded-lg px-3 py-2 bg-white
           ${isFocused
             ? 'border-indigo-500 ring-2 ring-indigo-200'
             : 'border-gray-300'}`,

        option: ({ isSelected, isFocused }) =>
          `px-3 py-2 cursor-pointer rounded-md
           ${isSelected ? 'bg-indigo-500 text-white' : ''}
           ${isFocused && !isSelected ? 'bg-indigo-50' : ''}`,

        menu: () => 'border border-gray-200 rounded-lg shadow-lg mt-1 bg-white text-black',

        menuList: () => 'p-1',

        placeholder: () => 'text-gray-400 text-sm',

        singleValue: () => 'text-gray-900 font-medium',

        input: () => 'text-gray-900',

        dropdownIndicator: () => 'text-gray-400 hover:text-gray-600',

        clearIndicator: () => 'text-gray-400 hover:text-red-500',

        indicatorSeparator: () => 'bg-gray-200',
      }}
    />
  )
}

export default CountryDropDown