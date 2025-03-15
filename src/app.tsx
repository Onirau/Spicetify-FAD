import { PgetConfig, PsaveConfig } from "./config";
import { Configuration } from "./types/config";

import "./css/fad/base.css"
import React from "react";
import ReactDOM from "react-dom";
import { FADRootComponent } from "./ui/FADRoot";
import { DispatchAction, GetState } from "./SMM/SMM";
import { useStatelessSMM } from "./SMM/useSMM";
import { getTranslate } from "./resources/locale";
import { Track } from "./types/track";

// HEAVILY USES EXISTING FAD CODE W/ HEAVY MODIFICATIONS
// https://github.com/huhridge/huh-spicetify-extensions/blob/main/fullAppDisplayModified/fullAppDisplayMod.js#L1612
// https://github.com/daksh2k/Spicetify-stuff/tree/232b892f2ba415152dff8060f83ecc2f704a3371/Extensions/full-screen/src

async function main() {
  while (!Spicetify || !Spicetify.Keyboard || !Spicetify.React || !Spicetify.ReactDOM || !Spicetify.Platform || !Spicetify.Platform.PlaybackAPI || !Spicetify.Platform.PlaybackAPI._isAvailable || !Spicetify.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // config overwrites
  function getConfig() {
    return PgetConfig()
  }

  function saveConfig() {
    DispatchAction({type: "SET_CONFIG", payload: CONFIG})
    return PsaveConfig(CONFIG)
  }

  // fad classes n stuff 
  class FAD extends React.Component {
    mouseTrap: any

    constructor(props: any) {
        super(props)

        // @ts-ignore
        this.mouseTrap = new Spicetify.Mousetrap()
    }

    componentDidMount(): void {
      document.addEventListener("fullscreenchange", this.handleFullscreenChange)
    }

    componentWillUnmount(): void {
      document.removeEventListener("fullscreenchange", this.handleFullscreenChange)
    }

    handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        removeFAD()
      }
    }

    render(): React.ReactNode {
        return <div id="fad-display-container">
          <FADRootComponent/>
        </div>
    }
  }

  // config
  let CONFIG: Configuration = getConfig()
  
  // enable window fullscreen
  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
          // Check if fullscreen is allowed before requesting
          if (GetState("isEnabled") && CONFIG["canFullscreen"]) {
              console.log("Requesting fullscreen...");
              await document.documentElement.requestFullscreen();
          }
      } else {
          console.log("Exiting fullscreen...");
          await document.exitFullscreen();
      }
  } catch (error) {
      console.error("Error toggling fullscreen:", error);
  }
}


  // enable FAD
  async function activateFAD() {
    console.log("[LMS] FAD ACTIVE REQ!");
    if (document.body.classList.contains("fad-active")) return

    DispatchAction({type: "SET_ENABLED", payload: true})
    ReactDOM.render(React.createElement(FAD), FADRootElement)

    await toggleFullscreen()
  }

  // disable FAD
  async function removeFAD() {
    console.log("[LMS] FAD REMOVE REQ!");
    if (!document.body.classList.contains("fad-active")) return

    // fad is removed in the FadRoot (dangerous but i want style)
    DispatchAction({type: "SET_ENABLED", payload: false})

    await toggleFullscreen()
  }

  // decide to on/off FAD
  function toggleFAD() {
    if (document.body.classList.contains("fad-active")) {
      removeFAD()
    } else {
      activateFAD()
    }
  }

  // Create FAD root element
  const FADRootElement = document.createElement("div")
  FADRootElement.id = "fad-root"
  document.body.appendChild(FADRootElement)
  console.log("setting root to", FADRootElement)
  DispatchAction({type: "SET_ROOT", payload: FADRootElement})

  // Check if FADRootElement is added to the DOM
  if (document.getElementById("fad-root")) {
    Spicetify.showNotification("[LMS] Root loaded!");
  } else {
    Spicetify.showNotification("[LMS] Root failed!", true);
    return; // Exit function if the element isn't added properly
  }

  // Show message on start.
  Spicetify.showNotification("[LMS] Required Modules Loaded!");
  console.log("[LMS] CUHS")

  // Bind Topbar FAD button
  useStatelessSMM("locale_id", () => {
    const fadButton = GetState("fadButton")
    if (fadButton) {
      fadButton.label = getTranslate("description.fullscreen")
    } else {
      DispatchAction({type: "SET_FADBUTTON", payload: new Spicetify.Topbar.Button(
        getTranslate("description.fullscreen"),
        `<svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">${Spicetify.SVGIcons.fullscreen}</svg>`,
        activateFAD
      )})
    }
  })

  function updateTrack() {
    const data = Spicetify.Player.data
    if (!data) {
      return setTimeout(() => {
        updateTrack() // fix potential bug? req before load
      }, 500)
    }

    const track: Track = {
      duration: data.duration!,
      progress: 0,
      metadata: data
    }

    DispatchAction({type: "SET_CURRENTTRACK", payload: track})
    console.log(track)
  }

  // Bind States to SMM
  Spicetify.Player.addEventListener("onplaypause", () => DispatchAction({type: "SET_PLAYING", payload: Spicetify.Player.isPlaying()}))
  Spicetify.Player.addEventListener("songchange", () => updateTrack())

  const volumeUpdate = (meta: any) => DispatchAction({type: "SET_VOLUMELEVEL", payload: meta.data.volume})
  Spicetify.Platform.PlaybackAPI._events.addListener("volume", volumeUpdate)

  // Update States to SMM
  DispatchAction({type: "SET_PLAYING", payload: Spicetify.Player.isPlaying()})
  DispatchAction({type: "SET_VOLUMELEVEL", payload: Spicetify.Player.getVolume()})
  DispatchAction({type: "SET_LOCALE", payload: CONFIG["localeID"]})
  DispatchAction({type: "SET_CONFIG", payload: CONFIG})

  useStatelessSMM("config", (config) => {
    if (config) {
      DispatchAction({type: "SET_LOCALE", payload: config.localeID})
      CONFIG = config
    }
  })

  useStatelessSMM("volumeLevel", (v) => {
    console.log("volume =>", v)
  })

  updateTrack() // update track (spotify plays a song on start not caught by songchange event)

  // Bind FAD button
  Spicetify.Mousetrap.bind("g", toggleFAD)

  document.addEventListener("contextmenu", (event) => {
    if (GetState("isEnabled") && !GetState("isSettingsEnabled")) {
      event.preventDefault();
      DispatchAction({
        type: "SET_SETTINGSENABLED",
        payload: true
      })
    }
  })

  // On Startup
  if (CONFIG["onStartUp"]) {
    activateFAD();
  } else {
    removeFAD()
  }

  // setTimeout(() => {
  //   DispatchAction({type: "SET_LOCALE", payload: "es"})
  // }, 5000)
}

export default main;
