import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
      <div className="flex flex-col items-center p-4">
        <img
          src="/loading.gif"
          alt="loading"
          className="w-32 h-32 md:w-48 md:h-48"
        />
        <p className="font-bold text-lg md:text-xl mt-4">Loading...</p>
      </div>
    </div>
  );
}
