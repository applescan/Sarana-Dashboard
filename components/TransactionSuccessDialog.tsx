import React, { FC } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
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
      <DialogContent className="mx-auto max-w-lg p-6">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogDescription className="mb-4 flex flex-col items-center gap-4 text-secondary-foreground">
            <FaCheckCircle
              className="h-24 w-24 text-primary"
              aria-hidden="true"
            />
            <DialogTitle className="text-2xl font-semibold text-primary-foreground">
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
