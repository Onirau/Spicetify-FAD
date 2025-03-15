import { LocaleID } from "../../resources/locale";
import { Configuration } from "../../types/config";
import { Track } from "../../types/track";

export type Action =
| {type: "SET_PLAYING", payload: boolean}
| {type: "SET_FULLSCREEN", payload: boolean}
| {type: "SET_ENABLED", payload: boolean}
| {type: "SET_SETTINGSENABLED", payload: boolean}
| {type: "SET_ROOT", payload: HTMLDivElement | undefined}
| {type: "SET_FADBUTTON", payload: Spicetify.Topbar.Button | undefined}
| {type: "SET_VOLUMELEVEL", payload: number}
| {type: "SET_LOCALE", payload: LocaleID}
| {type: "SET_CURRENTTRACK", payload: Track | undefined}
| {type: "SET_NEXTTRACK", payload: Track | undefined}
| {type: "SET_CONFIG", payload: Configuration | undefined}