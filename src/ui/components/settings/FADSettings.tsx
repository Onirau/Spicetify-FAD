import React, { useEffect, useRef, useState } from "react";
import { Configuration } from "../../../types/config";
import { useSMM } from "../../../SMM/useSMM";
import { DispatchAction } from "../../../SMM/SMM";

function FADSettings() {
    const config = useSMM("config")
    const settingsRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (key: keyof Configuration, value: any) => {
        console.log("update the config", key, "set to", value)

        DispatchAction({
            type: "SET_CONFIG",
            payload: {
                ...config,
                [key]: value
            } as Configuration
        })
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (event.button === 0 && settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
            // Clicked outside of the settings box, dispatch an action to close or reset settings
            DispatchAction({
                type: "SET_SETTINGSENABLED",
                payload: false
            });
        }
    };

    useEffect(() => {
        // Attach event listener when component mounts
        console.log("listening for mouse downs.")
        document.addEventListener("mousedown", handleOutsideClick);

        // Cleanup the event listener when component unmounts
        return () => {
            console.log("released listening for mouse downs.")
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div id="fad-settings-root" style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}>
            <div ref={settingsRef} style={{
                width: "400px",
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
            }}>
                <h2>Settings</h2>

                {/* Toggle: onStartUp */}
                <div>
                    <label>Run on Startup</label>
                    <input 
                        type="checkbox"
                        checked={config?.onStartUp}
                        onChange={(e) => handleChange("onStartUp", e.target.checked)}
                    />
                </div>

                {/* Toggle: canFullscreen */}
                <div>
                    <label>Enable Fullscreen</label>
                    <input 
                        type="checkbox"
                        checked={config?.canFullscreen}
                        onChange={(e) => handleChange("canFullscreen", e.target.checked)}
                    />
                </div>

                {/* Dropdown: localeID */}
                <div>
                    <label>Language</label>
                    <select 
                        value={config?.localeID}
                        onChange={(e) => handleChange("localeID", e.target.value)}
                    >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                    </select>
                </div>

                {/* Toggle: edgeGlow */}
                <div>
                    <label>Enable Edge Glow</label>
                    <input 
                        type="checkbox"
                        checked={config?.edgeGlow}
                        onChange={(e) => handleChange("edgeGlow", e.target.checked)}
                    />
                </div>

                {/* Dropdown: bgType */}
                <div>
                    <label>Background Type</label>
                    <select 
                        value={config?.bgType}
                        onChange={(e) => handleChange("bgType", e.target.value)}
                    >
                        <option value="STATIC">Static</option>
                        <option value="ARTIST">Artist</option>
                        <option value="ALBUM">Album</option>
                    </select>
                </div>

                {/* Input: bgBlur */}
                <div>
                    <label>Background Blur</label>
                    <input 
                        type="number"
                        value={config?.bgBlur}
                        onChange={(e) => handleChange("bgBlur", Number(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
}

export default FADSettings;