'use client';
import React from 'react';
import Button from '../components/ui/Button';

const GlobalError: React.FC = () => {
  return (
    <div className="w-full h-[70vh] flex flex-col md:flex-row justify-between items-center gap-20">
      <img
        src="/404.png"
        alt="404 Error"
        className="w-1/2 h-auto object-contain"
      />
      <div className="w-full md:w-1/2 p-4 md:p-8">
        <h1 className="font-extrabold text-6xl pb-2">Oops!</h1>
        <p>Sorry for the inconvenience, maybe try reloading this page again.</p>
        <Button variant="brand" className="h-10 text-sm font-normal mt-4">
          <a href={'/'}>Go back home</a>
        </Button>
      </div>
    </div>
  );
};

export default GlobalError;
