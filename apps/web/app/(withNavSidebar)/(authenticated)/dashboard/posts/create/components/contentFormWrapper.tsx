import { SimpleEditor } from '@repo/ui/tiptap/components/tiptap-templates/simple/simple-editor';
import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEvent,
  FocusEventHandler,
  ReactNode,
} from 'react';

type ContentFormWrapperProps = {
  label?: string | ReactNode;
  showErrorText?: boolean;
  name: string;
  defaultValue?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

/**
 * FormEditor bridges useForm's `register(name)` output to SimpleEditor.
 *
 * FIXME: This shouldn't be necessary unless a proper abstraction is needed
 */
export const ContentFormWrapper = ({
  label,
  showErrorText,
  name,
  defaultValue,
  onBlur,
  error,
  onChange,
}: ContentFormWrapperProps) => (
  <SimpleEditor
    label={label}
    showErrorText={showErrorText}
    name={name}
    defaultValue={defaultValue}
    onBlur={(event) =>
      onBlur?.({
        target: { value: event.target.value },
      } as unknown as FocusEvent<HTMLInputElement>)
    }
    onChange={(markdown) =>
      onChange?.({
        target: { value: markdown },
      } as unknown as ChangeEvent<HTMLInputElement>)
    }
    error={error}
  />
);

export default ContentFormWrapper;
