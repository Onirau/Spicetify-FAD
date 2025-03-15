import { PsaveConfig } from "../config";
import { Action } from "./State/actions";
import { defaultState, State } from "./State/states";

type Listener = () => void

export class SMM {
	private static instance: SMM;
	private currentState: State = defaultState;
	private listeners: { [key: string]: Listener[] } = {}

	public static getInstance() {
		if (!SMM.instance) {
			SMM.instance = new SMM()
		}

		return SMM.instance;
	}

	public getState<K extends keyof State>(k: K): State[K] {
		return this.currentState[k]
	}
 	
	private notifySubscriptions<K extends keyof State>(k: K) {
		if (this.listeners[k]) {
			this.listeners[k].forEach(listener => listener())
		}
	}

	public dispatchAction(action: Action) {
		switch(action.type) {
			case "SET_PLAYING":
				this.currentState.isPlaying = action.payload
				this.notifySubscriptions("isPlaying")
				break;
			case "SET_FULLSCREEN":
				this.currentState.isFullscreen = action.payload
				this.notifySubscriptions("isFullscreen")
				break;
			case "SET_ENABLED":
				this.currentState.isEnabled = action.payload
				this.notifySubscriptions("isEnabled")
				break;
			case "SET_SETTINGSENABLED":
				this.currentState.isSettingsEnabled = action.payload
				this.notifySubscriptions("isSettingsEnabled")
				break;
			case "SET_ROOT":
				this.currentState.fadRoot = action.payload
				this.notifySubscriptions("fadRoot")
				break;
			case "SET_FADBUTTON":
				this.currentState.fadButton = action.payload
				this.notifySubscriptions("fadButton")
				break;
			case "SET_VOLUMELEVEL":
				this.currentState.volumeLevel = action.payload
				this.notifySubscriptions("volumeLevel")
				break;
			case "SET_LOCALE":
				this.currentState.locale_id = action.payload
				this.notifySubscriptions("locale_id")
				break;
			case "SET_CONFIG":
				this.currentState.config = action.payload
				if (action.payload) PsaveConfig(action.payload)
				this.notifySubscriptions("config")
				break
			case "SET_CURRENTTRACK":
				this.currentState.currentTrack = action.payload
				this.notifySubscriptions("currentTrack")
				break;
			case "SET_NEXTTRACK":
				this.currentState.nextTrack = action.payload
				this.notifySubscriptions("nextTrack")
				break;
		} 
	}	

	public subscribeState<K extends keyof State>(k: K, listener: Listener) {
		if (!this.listeners[k]) this.listeners[k] = []
		this.listeners[k].push(listener)
	}

	public unsubscribeState<K extends keyof State>(k: K, listener: Listener) {
		if (!this.listeners[k]) return
		this.listeners[k] = this.listeners[k].filter(l => l !== listener)
	}
}

export function DispatchAction(action: Action): void {
	return SMM.getInstance().dispatchAction(action)
}

export function GetState<K extends keyof State>(k: K): State[K] {
	return SMM.getInstance().getState(k)
}