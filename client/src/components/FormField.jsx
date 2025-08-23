import React from 'react'
import { useTheme } from '../context/ThemeContext';

const FormField = ({ labelName, placeholder, inputType, isTextArea, value, handleChange }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className={`font-epilogue font-medium text-[14px] leading-[22px] ${isDarkMode ? 'text-[#808191]' : 'text-gray-600'} mb-[10px]`}>{labelName}</span>
      )}
      {isTextArea ? (
        <textarea 
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] ${
            isDarkMode ? 'border-[#3a3a43] text-white' : 'border-gray-300 text-gray-800'
          } bg-transparent font-epilogue text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]`}
        />
      ) : (
        <input 
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] ${
            isDarkMode ? 'border-[#3a3a43] text-white' : 'border-gray-300 text-gray-800'
          } bg-transparent font-epilogue text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]`}
        />
      )}
    </label>
  )
}

export default FormField