import { randCatchPhrase, randParagraph } from '@ngneat/falso';

export type TestPost = {
  title: string;
  content: string;
};

// Same reasoning as buildTestUser in auth-helpers.ts: realistic, varied
// data instead of static fixtures. Tests that specifically assert a
// title → slug transformation (e.g. collision suffixing) should pass an
// explicit literal title instead of relying on the random default — see
// CODESTYLE.md's Testing section.
export const buildTestPost = (overrides: Partial<TestPost> = {}): TestPost => ({
  title: randCatchPhrase(),
  content: randParagraph(),
  ...overrides,
});
