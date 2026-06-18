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
  defaultValues?: Partial<U>,
) => {
  const [errorObject, setErrorObject] = useState<{
    formSubmit: string;
    [key: string]: string;
  }>({
    formSubmit: '',
  });

  const [actionState, action, isSubmitting] = useActionState<
    Partial<U>,
    FormData
  >(
    async (_state, formData) => {
      setErrorObject({
        formSubmit: '',
      });
      setErrorObject((prev) => ({
        ...prev,
        formSubmit: '',
      }));
      const rawData = Object.fromEntries(formData.entries()) as Partial<U>;
      try {
        const submitPayload = validationSchema.parse(rawData) as U;
        await onSubmit(submitPayload);
      } catch (e) {
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
          setErrorObject({
            formSubmit: e.message,
          });
        } else {
          throw e;
        }
      }
      return rawData;
    },
    (defaultValues || {}) as Awaited<Partial<U>>,
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
