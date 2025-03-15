import { GetState } from '../../SMM/SMM';
import en from './translations/en.json';
import es from './translations/es.json';

type Translation = {
	langName: string
	strings: {
		actions: {
		}
		description: {
			fullscreen: string
		}
	}
};

export type LocaleID = "en" | "es"

const translations: Record<LocaleID, Translation> = {
	en,
	es
}

export const getTranslate = (key: string): string => {
	const locale = GetState("locale_id");
	const keys = key.split('.'); // Split the key by dots to access nested properties
  
	let translation: any = translations[locale].strings;
	console.log(translation)
	for (const k of keys) {
		// console.log(k)
		translation = translation[k];
		// console.log(translation)
		if (translation === undefined) return key; // Return the key if translation is not found
	}
  
	return translation || key;
};

export const useTranslate = (locale: LocaleID, key: string): string => {
	const keys = key.split('.'); // Split the key by dots to access nested properties
  
	let translation: any = translations[locale].strings;
	for (const k of keys) {
		translation = translation[k];
		if (translation === undefined) return key; // Return the key if translation is not found
	}
  
	return translation || key;
}