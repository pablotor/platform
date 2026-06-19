export type ToastMode = 'loading' | 'info' | 'success' | 'error';

export type ToastRecord = {
  id: string;
  toastKey?: string;
  mode: ToastMode;
  content?: string | React.ReactNode;
  duration: number;
  open: boolean;
};
