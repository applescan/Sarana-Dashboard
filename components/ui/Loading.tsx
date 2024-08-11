import React from 'react';

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="flex flex-col items-center pb-4">
        <img src="/loading.gif" alt="loading" className="w-[200px] h-[200px]" />
        <p className="font-bold text-xl">Loading...</p>
      </div>
    </div>
  );
}
