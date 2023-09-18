import {
  seasons,
  adjectives,
  nouns,
  colors,
  animals,
  verbs,
  cosmos as cosmosWords,
} from './dictionary/en';

import { emojis } from './dictionary/emojis';

export * from './dictionary/emojis';
export * from './dictionary/en';

export const spaceSlugDefaultDictionary: Record<string, SpaceSlugDictionary> = {
  en: {
    seasons,
    emojis,
    adjectives,
    nouns,
    colors,
    animals,
    verbs,
    cosmos: cosmosWords,
  },
};

export const spaceSlugDefaultOptions: Partial<SpaceSlugOptions> = {
  locale: 'en',
  separator: '-',
  dictionary: spaceSlugDefaultDictionary,
};

export type SpaceSlugDictionary = Partial<{
  [key: string]: string[];
  adjectives: string[];
  animals: string[];
  colors: string[];
  cosmos: string[];
  emojis: string[];
  nouns: string[];
  seasons: string[];
  verbs: string[];
}>;

export type SpaceSlugOptions = {
  cleanString?: (word: string) => string;
  dictionary?: Record<string, SpaceSlugDictionary>;
  locale?: string;
  separator?: string;
  transform?: (word: string) => string;
};

export type SpaceSlugFn = (options: SpaceSlugOptions) => SpaceSlugFnOutput;

export type SpaceSlugFnOutput = Set<string> | string | string[];

export type SpaceSlugInput = SpaceSlugFn | SpaceSlugFnOutput;

export type UniqueSpaceSlugOptions = {
  isUnique?: (slug: string) => Promise<boolean>;
  makeUnique?: (slug: string) => Promise<string>;
  maxAttempts?: number;
  usedSlugs?: string[];
};

export const word =
  (type: string) =>
  (count?: number, _words?: string[]) =>
  (options: SpaceSlugOptions) => {
    const words = (
      _words?.length
        ? _words
        : (options.dictionary?.[options.locale!] as any)[type]
    ) as string[];

    if (!words?.length) {
      throw new Error(`No words found for ${type}`);
    }

    const c = count || 1;

    if (c > words.length) {
      throw new Error(
        `Cannot generate ${c} unique words from ${words.length} words`
      );
    }

    const set = new Set<string>();

    while (set.size < c) {
      const index = Math.floor(Math.random() * words.length);
      set.add(words[index]);
    }

    return set;
  };

export const noun = word('nouns');

export const adjective = word('adjectives');

export const color = word('colors');

export const season = word('seasons');

export const emoji = word('emojis');

export const verb = word('verbs');

export const animal = word('animals');

export const cosmos = word('cosmos');

export const digits =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (count?: number, noConsecutive?: boolean) => (options: SpaceSlugOptions) => {
    const c = count || 4;

    const list: string[] = [];

    while (list.length < c) {
      const value = Math.floor(Math.random() * 10).toString();
      const latest = list.length ? list[list.length - 1] : null;
      if (noConsecutive && latest !== null && latest === value) {
        // eslint-disable-next-line no-continue
        continue;
      }
      list.push(value);
    }

    return list.map((x) => x.toString()).join('');
  };

export const cleanString = (inputString: string, separator: string) =>
  inputString
    .replace(/[^a-zA-Z0-9\s]+/g, '')
    .replace(/\s+/g, separator)
    .trim();

// eslint-disable-next-line no-underscore-dangle
const _uniqueSpaceSlug = async (
  spaceSlugFn: SpaceSlugInput[],
  options: SpaceSlugOptions & UniqueSpaceSlugOptions,
  attempts: number
): Promise<string> => {
  const slug = spaceSlug(spaceSlugFn, options);
  const maxAttempts = options.maxAttempts || 5;

  if (attempts > maxAttempts) {
    throw new Error(
      `Could not generate unique slug after ${options.maxAttempts} attempts`
    );
  }

  if (options.usedSlugs && options.usedSlugs.includes(slug)) {
    return _uniqueSpaceSlug(spaceSlugFn, options, attempts + 1);
  }

  if (options.isUnique) {
    const isUnique = await options.isUnique(slug);

    if (!isUnique) {
      if (options.makeUnique) {
        const uniqueSlug = await options.makeUnique(slug);
        return _uniqueSpaceSlug([uniqueSlug], options, attempts + 1);
      }

      return _uniqueSpaceSlug(spaceSlugFn, options, attempts + 1);
    }
  }

  return slug;
};

export const uniqueSpaceSlug = async (
  spaceSlugFn: SpaceSlugInput[],
  options: SpaceSlugOptions & UniqueSpaceSlugOptions = {}
) => _uniqueSpaceSlug(spaceSlugFn, options, 1);

export const spaceSlug = (
  spaceSlugInputs?: SpaceSlugInput[],
  options: SpaceSlugOptions = {}
) => {
  const mergedOptions = {
    ...spaceSlugDefaultOptions,
    ...options,
  };

  const transformFn = mergedOptions.transform || ((x) => x.toLowerCase());

  // eslint-disable-next-line no-underscore-dangle
  const _spaceSlugFns = !spaceSlugInputs?.length
    ? [adjective(1), noun(1), digits(2)]
    : spaceSlugInputs;

  // eslint-disable-next-line no-underscore-dangle
  const _cleanString = options.cleanString
    ? options.cleanString
    : (s: string) => cleanString(s, mergedOptions.separator as string);

  const slug = _spaceSlugFns.map((fn) => {
    const set = typeof fn === 'function' ? fn(mergedOptions) : fn;

    let s: string;

    if (typeof set === 'string') {
      s = _cleanString(set);
    } else if (typeof set === 'object' && set instanceof Set) {
      s = Array.from(set).map(_cleanString).join(mergedOptions.separator);
    } else if (Array.isArray(set)) {
      s = set.map(_cleanString).join(mergedOptions.separator);
    } else {
      throw new Error('Invalid space slug function output');
    }

    return transformFn(s);
  });

  return slug.join(mergedOptions.separator);
};
