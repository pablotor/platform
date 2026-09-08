import { RegistrableFieldProps } from '@repo/ui/inputs/types';
import {
  ComponentProps,
  useActionState,
  useCallback,
  useRef,
  useState,
} from 'react';
import { z, ZodError } from 'zod';

export type RegistrableElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

type NullableObject<T> = {
  [K in keyof T]: T[K] | null;
};

/**
 * useForm is a simplified version of the useForm library. It is:
 * - Validation first: a zod validation schema is required
 * - Uncontrolled but reactive: allows you to react to input changes, but
 * handles the input values uncontrolled (as it always should have been)
 * - Action based: uses action instead of onSubmit as it's the direction
 * React19 took
 */
const useForm = <U extends Record<string, unknown>>(
  onSubmit: (formPayload: U) => unknown | Promise<unknown>,
  validationSchema: z.ZodObject,
  options: {
    defaultValues?: Partial<NullableObject<U>>;
    onValidationFail?: (error: ZodError) => void;
  } = {},
) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [errorObject, setErrorObject] = useState<{
    [key: string]: string;
  }>({});

  const [actionState, action, isSubmitting] = useActionState<
    Partial<U>,
    FormData
  >(
    async (_state, formData) => {
      setErrorObject({});
      const rawData = Object.fromEntries(formData.entries()) as Partial<U>;
      try {
        const submitPayload = validationSchema.parse(rawData) as U;
        await onSubmit(submitPayload);
      } catch (e) {
        if (e instanceof ZodError) {
          console.warn('Validation failed', e.message);
          console.warn({ rawData });
          setErrorObject(
            Object.fromEntries(
              e.issues.map((innerError) => [
                innerError.path,
                innerError.message,
              ]),
            ),
          );
        } else {
          throw e;
        }
      }
      return rawData;
    },
    (options.defaultValues || {}) as Awaited<Partial<U>>,
  );

  /**
   * This handler duplicates the validation that also happens inside the
   * useActionState reducer above. It exists purely to avoid a UX
   * flicker: without it, clicking "submit" on an invalid form would
   * still dispatch the action, briefly flipping `isSubmitting` to true
   * (and, for multi-part forms, giving no chance to redirect the user
   * to the offending section) before the reducer rejects it a tick
   * later. Running the same check synchronously in the native
   * `onSubmit` event lets us call preventDefault() *before* the action
   * ever dispatches, so isSubmitting never flips for input the client
   * can already tell is invalid.
   *
   * This is a client-side convenience layer only — it does not replace
   * the reducer's own validation, which remains the source of truth
   * for any submission path that bypasses this event (e.g. a
   * programmatic formRef.current.requestSubmit() call).
   *
   * Caveat: this only works for schemas that validate synchronously.
   * If validationSchema ever grows an async refinement, safeParse
   * here won't be able to evaluate it before the event loop moves on,
   * and this guard will silently let invalid data through to the
   * reducer (which will still catch it, just with the flicker back).
   */
  const onFormSubmit = useCallback(
    (event: React.SubmitEvent) => {
      const formData = new FormData(event.target);
      const rawData = Object.fromEntries(formData.entries());
      const result = validationSchema.safeParse(rawData);

      if (!result.success) {
        event.preventDefault();
        setErrorObject(
          Object.fromEntries(
            result.error.issues.map((issue) => [issue.path[0], issue.message]),
          ),
        );
        options.onValidationFail?.(result.error);
      }
    },
    [validationSchema, options],
  );

  const validate = useCallback(
    <K extends keyof U & string>(name: K, value: unknown) =>
      validationSchema
        .pick({ [name]: true } as Record<string, true>)
        .parseAsync({ [name]: value })
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
    [validationSchema],
  );

  /**
   * register(name)
   *
   * Wires a single uncontrolled input up to the form's validation and state.
   * Spread the result onto an <input> (or a compatible custom input component)
   * to get, for free:
   *
   * - `name` — the field name, used both as the FormData key on submit and as
   *   the lookup key into actionState/errorObject.
   * - `defaultValue` — seeded from the last submitted actionState for this
   *   field (falls back to '' on first render). Because inputs stay
   *   uncontrolled, this only affects what the input renders on *mount* —
   *   updating it after the fact won't push a new value into an
   *   already-mounted input. If you need to force a visual reset (e.g. after
   *   restoring persisted state, or remounting a section), pair this with a
   *   `key` change on the input/form so React treats it as a fresh mount.
   * - `onBlur` — runs a single-field validation (`validationSchema.pick(name)`)
   *   against the field's current value as soon as the user leaves it. This is
   *   independent from, and runs earlier than, the full-form validation done
   *   on submit (see registerForm/onFormSubmit) — it exists purely to give
   *   fast, field-scoped feedback while the user is still filling the form
   *   in, before they've attempted to submit anything.
   * - `error` — the current validation message for this field, if any. Cleared
   *   automatically once the field passes its own onBlur check again, or
   *   explicitly via `clearFieldErrors([name])` (e.g. called by a composing
   *   hook like useSectionedForm after a broader validation pass).
   *
   * Note: `register` does not itself trigger re-renders on every keystroke —
   * values are read from the DOM (via FormData) only when needed, which is
   * what "uncontrolled but reactive" refers to in the module doc above.
   */
  const register = useCallback(
    <
      K extends keyof U & string,
      Element extends RegistrableElement = HTMLInputElement,
    >(
      name: K,
    ): RegistrableFieldProps<U[K], Element> & { name: K } => ({
      name,
      defaultValue:
        (actionState[name] as unknown as NonNullable<U[K]>) ??
        ('' as NonNullable<U[K]>),
      onBlur: (event) => validate(name, event.target.value),
      error: errorObject[name as string],
    }),
    [actionState, errorObject, validate],
  );

  /**
   * registerForm()
   *
   * Spread onto the <form> element itself: `<form {...registerForm()}>`.
   * Bundles together everything the form tag needs to participate in the
   * action-based submit flow:
   *
   * - `ref` — exposes the underlying form DOM node as `formRef`, so both this
   *   hook and any hook composing it (e.g. a sectioned/multi-part form) can
   *   read live FormData (for cross-field or partial validation, status
   *   tracking, etc.) without waiting for a submit.
   * - `action` — the useActionState-bound action. On successful validation
   *   this is what actually calls the provided `onSubmit` and updates
   *   `isSubmitting`/`actionState`.
   * - `onSubmit` — a synchronous pre-check that runs the full validationSchema
   *   against the form's current values *before* the action dispatches. If
   *   validation fails, it calls `preventDefault()` so the action never fires
   *   at all — this avoids a UX flicker where `isSubmitting` would otherwise
   *   briefly flip to true for input the client already knows is invalid. It
   *   also fires `options.onValidationFail(error)` if provided, which
   *   composing hooks use to react to a failed submit attempt (e.g. jumping
   *   the user to the first section/step containing an invalid field).
   *
   *   This onSubmit check is a client-side convenience layer, not a
   *   replacement for the action's own validation — the reducer still
   *   validates independently, so any submission path that bypasses this
   *   event (e.g. a programmatic `formRef.current.requestSubmit()` call)
   *   remains safe. It also only catches validation that can run
   *   synchronously; async schema refinements won't be evaluable here and
   *   will fall through to the (flicker-prone) action-level check instead.
   *
   * registerForm is a function rather than a static object so its shape can
   * later accept per-call overrides (e.g. a one-off onValidationFail) without
   * a breaking change, consistent with how `register(name)` takes arguments.
   */
  const registerForm = useCallback(
    (): Pick<ComponentProps<'form'>, 'ref' | 'action' | 'onSubmit'> => ({
      action,
      onSubmit: onFormSubmit,
      ref: formRef,
    }),
    [action, onFormSubmit],
  );

  /**
   * If fields is not provided, all fields are checked
   */
  const validateFields = useCallback(
    (fields?: (keyof U)[]) => {
      if (!formRef.current) {
        console.error('Form ref was not mounted');
        return;
      }
      const entries = Array.from(new FormData(formRef.current).entries());
      const rawData = Object.fromEntries(
        fields ? entries.filter(([key]) => fields.includes(key)) : entries,
      );
      const filteredValidationSchema = fields
        ? validationSchema.pick(
            Object.fromEntries(fields.map((field) => [field, true])) as Record<
              string,
              true
            >,
          )
        : validationSchema;
      const validationResult = filteredValidationSchema.safeParse(rawData);
      setErrorObject((prev) => {
        const newErrors = Object.fromEntries(
          validationResult.error?.issues.map((innerError) => [
            innerError.path,
            innerError.message,
          ]) || [],
        );
        if (!fields) return newErrors;
        const prevErrors = Object.fromEntries(
          Object.entries(prev).filter(([key]) => !fields.includes(key)),
        );
        return { ...prevErrors, ...newErrors };
      });
      return validationResult;
    },
    [validationSchema, formRef],
  );

  return {
    registerForm,
    register,
    isSubmitting,
    errorObject,
    validate,
    validateFields,
  };
};

export default useForm;
