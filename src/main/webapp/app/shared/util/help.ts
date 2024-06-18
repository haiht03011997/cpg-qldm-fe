import { toast } from 'react-toastify';

export const handleBeforeunload = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  return (event.returnValue = '');
};

export const checkFileExtension = file => {
  const isExcel = file?.name?.endsWith('.xls') || file?.name?.endsWith('.xlsx');
  if (!isExcel) {
    toast.error('Tệp tin không đúng định dạng', { position: 'top-left' });
    return false;
  }
  return true;
};
