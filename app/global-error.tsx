'use client';
import React, { FC } from 'react';
import Button from '../components/ui/Button';

const GlobalError: FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col md:flex-row items-center justify-center bg-white px-4 py-8">
      <div className="flex items-center justify-center w-full max-w-md mb-8 md:mb-0 md:w-1/2">
        <img
          src="/404.png"
          alt="404 Error"
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="flex flex-col items-center w-full max-w-md text-center md:text-left md:w-1/2 md:pl-8">
        <h1 className="font-extrabold text-4xl md:text-6xl mb-4">Oops!</h1>
        <p className="mb-4 text-center">
          Sorry for the inconvenience. Maybe try reloading this page again.
        </p>
        <Button variant="outline-primary" className="h-10 text-sm font-normal">
          <a href="/">Go back home</a>
        </Button>
      </div>
    </div>
  );
};

export default GlobalError;
