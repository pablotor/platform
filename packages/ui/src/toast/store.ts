import { ToastRecord } from './types';

type ToastState = {
  toasts: ToastRecord[];
};

type ToastAction =
  | { type: 'ADD_TOAST'; toast: ToastRecord }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToastRecord> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string };

// ─────────────────────────────────────────────────────────────────────────
// Store
//
// A tiny pub/sub store that lives outside React so `toast(...)` can be
// called from anywhere (event handlers, async functions, other modules)
// without needing access to a hook.
// ─────────────────────────────────────────────────────────────────────────

const TOAST_REMOVE_DELAY = 300; // matches the exit transition below

let memoryState: ToastState = { toasts: [] };
let listeners: Array<() => void> = [];

const emit = (): void => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void): (() => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const getSnapshot = (): ToastState => memoryState;

// must be a stable reference — toasts never exist during SSR, so this
// constant (not a fresh object per call) avoids re-render loops
const serverState: ToastState = { toasts: [] };
const getServerSnapshot = (): ToastState => serverState;

const reducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };
    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined
            ? { ...t, open: false }
            : t,
        ),
      };
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) return { ...state, toasts: [] };
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

const dispatch = (action: ToastAction): void => {
  memoryState = reducer(memoryState, action);
  emit();
};

const scheduleRemoval = (id: string): void => {
  setTimeout(
    () => dispatch({ type: 'REMOVE_TOAST', toastId: id }),
    TOAST_REMOVE_DELAY,
  );
};

const dismiss = (toastId?: string): void => {
  dispatch({ type: 'DISMISS_TOAST', toastId });
  if (toastId !== undefined) {
    scheduleRemoval(toastId);
  } else {
    memoryState.toasts.forEach((t) => scheduleRemoval(t.id));
  }
};

const exists = (toastId?: string): boolean =>
  memoryState.toasts.some((t) => t.id === toastId);

export { dismiss, dispatch, exists, getSnapshot, getServerSnapshot, subscribe };
