import React, { FC } from 'react';
import Button from './ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './ui/Dialog';

interface TransactionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionSuccessModal: FC<TransactionSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg mx-auto p-4">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogDescription className="mb-4">
            <img
              src="/buy.gif"
              alt="Transaction Successful"
              className="w-1/2 sm:w-1/3 md:w-1/4 h-auto mx-auto"
            />
            <DialogTitle className="text-lg sm:text-xl md:text-2xl text-gray-900 pt-4">
              Transaction Successful
            </DialogTitle>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center p-0">
          <DialogClose asChild>
            <Button onClick={onClose} variant="brand" className="mt-4">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionSuccessModal;
