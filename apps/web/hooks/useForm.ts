import { useToast } from '@repo/ui/toast/handler';
import { ComponentProps, useActionState, useCallback, useState } from 'react';
import { z, ZodError } from 'zod';

/**
 * useForm is a simplified version of the useForm library. It is:
 * - Validation first: a zod validation schema is required
 * - Uncontrolled but reactive: allows you to react to input changes, but
 * handles the input values uncontrolled (as it always should have been)
 * - Action based: uses action instead of onSubmit as it's the direction
 * React19 took
 */
const useForm = <U extends Record<keyof U, unknown>>(
  onSubmit: (formPayload: U) => void | Promise<void>,
  validationSchema: z.ZodObject,
  options: {
    defaultValues?: Partial<U>;
    successMessage?: string;
  } = {},
) => {
  const [errorObject, setErrorObject] = useState<{
    formSubmit: string;
    [key: string]: string;
  }>({
    formSubmit: '',
  });

  const { toast } = useToast();

  const [actionState, action, isSubmitting] = useActionState<
    Partial<U>,
    FormData
  >(
    async (_state, formData) => {
      const submitToast = toast({ mode: 'loading' });
      setErrorObject({
        formSubmit: '',
      });
      const rawData = Object.fromEntries(formData.entries()) as Partial<U>;
      try {
        const submitPayload = validationSchema.parse(rawData) as U;
        await onSubmit(submitPayload);
        submitToast.update({
          mode: 'success',
          content: options.successMessage,
        });
      } catch (e) {
        submitToast.update({ mode: 'error' });
        if (e instanceof ZodError) {
          console.warn('Validation failed', e.message);
          setErrorObject({
            formSubmit: '',
            ...Object.fromEntries(
              e.issues.map((innerError) => [
                innerError.path,
                innerError.message,
              ]),
            ),
          });
        } else if (e instanceof Error) {
          submitToast.update({
            mode: 'error',
            content: e.message,
            duration: Infinity,
          });
          setErrorObject({
            formSubmit: e.message,
          });
        } else {
          throw e;
        }
      }
      return rawData;
    },
    (options.defaultValues || {}) as Awaited<Partial<U>>,
  );

  const register = useCallback(
    (
      name: keyof U,
    ): Partial<ComponentProps<'input'>> & {
      error?: string;
    } => ({
      name: name as string,
      defaultValue:
        (actionState[name] as string | number | readonly string[]) || '',
      onBlur: (event) =>
        validationSchema
          .pick({ [name]: true } as Record<string, true>)
          .parseAsync({ [name]: event.target.value })
          .then(() =>
            setErrorObject((prev) => ({
              ...prev,
              [name]: '',
            })),
          )
          .catch((error) => {
            if (error instanceof ZodError) {
              setErrorObject((prev) => ({
                ...prev,
                [name]: error.issues[error.issues.length - 1]?.message || '',
              }));
            }
          }),
      error: errorObject[name],
    }),
    [actionState, errorObject, validationSchema],
  );

  return {
    action,
    register,
    submitError: errorObject.formSubmit,
    isSubmitting,
  };
};

export default useForm;
