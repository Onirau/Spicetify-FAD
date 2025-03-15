import { LocaleID } from "../resources/locale"

export interface Configuration {
    onStartUp: boolean // run activate on start
    canFullscreen: boolean // can activate fullscreen webkit
    localeID: LocaleID // language

    // styling
    edgeGlow: boolean
    bgType: "STATIC" | "ARTIST" | "ALBUM"
    bgBlur: number
}

export const ConfigurationDefault: Configuration = {
    onStartUp: true,
    canFullscreen: false,
    localeID: "en",

    edgeGlow: false,
    bgType: "ARTIST",
    bgBlur: 10
}