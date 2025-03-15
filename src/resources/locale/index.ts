import { createContext, useEffect, useState } from 'react';
import { GetState } from '../../SMM/SMM';

import en from './translations/en.json';
import es from './translations/es.json';
import de from './translations/de.json';
import fr from './translations/fr.json';

import { useSMM } from '../../SMM/useSMM';

type Translation = {
	langName: string;
	strings: {
		actions: {};
		description: {
			fullscreen: string;
		};
		settings: {
			settings_title: string;
			language: string;
			on_startup: string;
			enable_fullscreen: string;
			enable_edgeglow: string;
			bg_type: string;
			bg_types: {
				album: string;
				static: string;
				artist: string;
			};
			bg_blur: string;
		};
	};
};

export type LocaleID = "en" | "es" | "fr" | "de"

export const translations: Record<LocaleID, Translation> = {
	en,
	es,
	fr,
	de
}

export const getTranslate = (key: string, locale_id?: LocaleID): string => {
	const locale = locale_id ?? GetState("locale_id");
	const keys = key.split('.'); // Split the key by dots to access nested properties
  
	let translation: any = translations[locale].strings;
	for (const k of keys) {
		translation = translation[k];

		if (translation === undefined) return key; // Return the key if translation is not found
	}
  
	return translation || key;
};

// React Compatability
export const useTranslate = () => {
	const locale_id = useSMM("locale_id"); // Get locale_id from your state management (SMM)
  
	const [translate, setTranslate] = useState<(key: string) => string>(() => {
	  return (key: string) => getTranslate(key, locale_id); // Initialize the translate function with the current locale
	});
  
	// Whenever locale_id changes, re-create the translate function
	useEffect(() => {
	  setTranslate(() => (key: string) => getTranslate(key, locale_id));
	}, [locale_id]); // Re-run this effect when locale_id changes
  
	return translate; // Return the translation function
  };