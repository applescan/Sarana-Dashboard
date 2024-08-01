import React, { ReactNode } from 'react';
import Button from './ui/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog';

export type PosDialog = {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  desc: ReactNode;
  onClick: () => void;
  button: string;
  disableButton?: boolean;
};

const PosDialog: React.FC<PosDialog> = ({
  open,
  onOpenChange,
  title,
  desc,
  onClick,
  button,
  disableButton,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClick} variant="brand" disabled={disableButton}>
              {button}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PosDialog;
