import { useEffect, useState } from "react";
import { SMM } from "./SMM";
import { State } from "./State/states";

export function useSMM<K extends keyof State>(k: K): State[K] {
	const smm = SMM.getInstance()
	const [state, setState] = useState(smm.getState(k))

	useEffect(() => {
		const listener = () => {
			setState(smm.getState(k))
		}

		smm.subscribeState(k, listener)

		return () => {
			smm.unsubscribeState(k, listener)
		}
	}, [k, smm])

	return state
}

export function useStatelessSMM<K extends keyof State>(key: K, callback: (value: State[K]) => void): () => void {
	const smm = SMM.getInstance();

	// Define the listener
	const listener = () => {
		const stateValue = smm.getState(key);
		callback(stateValue);
	};

	// Subscribe to the state
	smm.subscribeState(key, listener);

	// Return an unsubscribe function
	return () => {
		smm.unsubscribeState(key, listener);
	};
}