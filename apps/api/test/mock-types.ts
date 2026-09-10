/**
 * Strips a class's private/protected "brand" so a plain mock object can
 * satisfy jest.Mocked<Public<T>> without also needing to supply values for
 * constructor-injected private fields (e.g. a service's private repository
 * dependency). `keyof T` already excludes private/protected members for a
 * class type — this produces a fresh, non-nominal object type with the same
 * public shape, rather than reusing the class type directly, which
 * TypeScript treats nominally the moment it has any private member.
 */
export type Public<T> = { [K in keyof T]: T[K] };
