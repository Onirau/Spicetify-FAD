import { LocaleID } from "../../resources/locale";
import { Configuration } from "../../types/config";
import { Track } from "../../types/track";

export type State = {
	isPlaying: boolean;
	isFullscreen: boolean; 
	isEnabled: boolean; 
	isSettingsEnabled: boolean;
	locale_id: LocaleID;
	config?: Configuration;
	fadRoot?: HTMLDivElement;
	fadButton?: Spicetify.Topbar.Button;
	volumeLevel: number;
	currentTrack?: Track
	nextTrack?: Track
}

export const defaultState: State = {
	isPlaying: false,
	isFullscreen: false,
	isEnabled: false,
	isSettingsEnabled: false,
	locale_id: "en",
	config: undefined,
	fadRoot: undefined,
	fadButton: undefined,
	volumeLevel: 0,
	currentTrack: undefined,
	nextTrack: undefined
}