import en from '@/locales/en.json';

type NestedKeyOf<T> = T extends object
    ? { [K in keyof T]: K extends string
        ? T[K] extends object
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`
        : never
    }[keyof T]
    : never;

type TranslationKey = NestedKeyOf<typeof en>;

/**
 * Get a translation value by key path
 * @example t('home.hero.title') → "Welcome"
 */
export function t(key: TranslationKey): string {
    const keys = key.split('.');
    let result: unknown = en;

    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = (result as Record<string, unknown>)[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    return typeof result === 'string' ? result : key;
}

/**
 * Get a nested translation object by key path
 * @example tObject('home.features.items') → [{...}, {...}]
 */
export function tObject<T = unknown>(key: string): T {
    const keys = key.split('.');
    let result: unknown = en;

    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = (result as Record<string, unknown>)[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return {} as T;
        }
    }

    return result as T;
}

export default en;
