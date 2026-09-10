import { FocusEventHandler } from 'react';

export interface RegistrableFieldProps<
  Value = string,
  Element extends HTMLElement = HTMLInputElement,
> {
  name: string;
  defaultValue: NonNullable<Value>;
  onBlur?: FocusEventHandler<Element>;
  // validate?: (value: string | number) => void;
  error?: string;
}
