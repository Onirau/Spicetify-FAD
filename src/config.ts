import { Configuration, ConfigurationDefault } from "./types/config"

export function PgetConfig(): Configuration {
    try {
      const rawConfig = Spicetify.LocalStorage.get("lmn-config-fad")
      if (rawConfig) {
        // merge with default for missing new settings
        return {...ConfigurationDefault, ...JSON.parse(rawConfig)}
      }
      throw ""
    } catch {
      return ConfigurationDefault
    }
  }
  
export function PsaveConfig(configuration: Configuration) {
    Spicetify.LocalStorage.set("lmn-config-fad", JSON.stringify(configuration))
}