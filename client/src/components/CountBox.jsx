import React from 'react'

const CountBox = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[150px] transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-[#4b0082] hover:shadow-lg hover:border hover:border-purple-500 rounded-[10px]">
      <h4 className="font-epilogue font-bold text-[30px] text-white p-3 bg-[#1c1c24] rounded-t-[10px] w-full text-center truncate hover:bg-[#6a0dad] transition-all duration-300 ease-in-out">
        {value}
      </h4>
      <p className="font-epilogue font-normal text-[16px] text-[#808191] bg-[#28282e] px-3 py-2 w-full rounded-b-[10px] text-center hover:bg-[#9370db] transition-all duration-300 ease-in-out">
        {title}
      </p>
    </div>
  )
}

export default CountBox
