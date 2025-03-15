import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useSMM } from "../SMM/useSMM";
import { DispatchAction, GetState } from "../SMM/SMM";
import { WebAPI } from "../utils/WebAPI";
import { Slider } from "./Slider";
import SmartElement from "./Smart";
import { PlaylistSkeleton } from "./components/playlist/Skeleton";
import { adjustColorBrightness } from "../utils/ColorUtils";
import { formatTime } from "../utils/TimeUtils";
import FADSettings from "./components/settings/FADSettings";

const {Flipper, Flipped} = Spicetify.ReactFlipToolkit

const LUMINANCE_TOLERANCE = 120

export function FADRootComponent() {
	const isEnabled = useSMM("isEnabled")
	const isSettingsEnabled = useSMM("isSettingsEnabled")
	const isPlaying = useSMM("isPlaying")
	const currentTrack = useSMM("currentTrack")
	const config = useSMM("config")

	const [artistArt, setArtistArt] = useState<string | null>(null);

	const [bgColor, setBgColor] = useState("#000000");
	const [textColor, setTextColor] = useState("#FFFFFF");

	const [progress, setProgress] = useState(0);
	const [dragging, setDragging] = useState(false);
	const [volume, setVolume] = useState(Spicetify.Player.getVolume() * 100);
	const [volumeDisplay, setVolumeDisplay] = useState(volume);

    const [favouriteAnimating, setFavouriteAnimating] = useState(false);
	
	const [playlists, setPlaylists] = useState<{uri: string, name: string, image?: string, selected: boolean; originalSelected: boolean; }[]>([]);
	const [knownPlaylistCount, setKnownPlaylistCount] = useState<number>(3)
	
	const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

	// Background Art; is Light/Dark
	const [darkMode, setDarkMode] = useState<boolean>(false);

	const getLuminance = (color: string): number => {
		const rgb: number[] = color.match(/\w\w/g)!.map(x => parseInt(x, 16));
		const luminance: number = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
		return luminance;
	};

	const getVolumeIcon = (volume: number) => {
		if (volume === 0) return Spicetify.SVGIcons["volume-off"];
		if (volume <= 50) return Spicetify.SVGIcons["volume-one-wave"];
		if (volume <= 75) return Spicetify.SVGIcons["volume-two-wave"];
		return Spicetify.SVGIcons["volume"];
	};

	const handleSliderChange = (newProgress: number) => {
		setProgress(newProgress);
	};

	const handleSliderChangeEnd = (newProgress: number) => {
		const duration = Spicetify.Player.getDuration();
		Spicetify.Player.seek((newProgress / 100) * duration);
		console.log("seeking to", (newProgress / 100) * duration);
	};

	const handleVolumeChange = (newVolume: number) => {
		setVolume(newVolume);
		setVolumeDisplay(newVolume);
		Spicetify.Player.setVolume(newVolume / 100);
	};

	const handleVolumeChangeEnd = (newVolume: number) => {
		Spicetify.Player.setVolume(newVolume / 100);
		console.log("volume set to", newVolume);
	};

	const isTrackInPlaylist = async (playlistUri: string) => {
		const playlist = await Spicetify.Platform.PlaylistAPI.getPlaylist(playlistUri);
		// console.log(playlist)
		// console.log(currentTrack)
		return playlist.contents.items.some((track: any) => track.uri === currentTrack?.metadata?.item?.uri);
	};

	const isLikedTrack = async () => {
		// const likedTracks = await Spicetify.Platform.LibraryAPI.getTracks({ limit: 10000 })
		// const likedTrackUris = new Set(likedTracks.items?.map((track: any) => track.uri));

		// return likedTrackUris.has(currentTrack?.metadata?.item?.uri);
		return Spicetify.Player.getHeart() // probably alot faster; see if theres issues else keep
	}

	const handlePlaylistButton = async () => {
		setShowPlaylistMenu(!showPlaylistMenu);
		console.log(`[LMC] show playlists to (${showPlaylistMenu})`)

		if (showPlaylistMenu) {
			handleCancel()
			return
		}; // menu is currently open

		const res = await Spicetify.Platform.RootlistAPI.getContents()
		console.log(res)
		let own_playlists = res.items.filter(
			(item: { type: string; name: string; canAdd?: boolean; }) => item.type === "playlist" && item.canAdd
		).map((item: any) => {
			return {
				name: item.name,
				uri: item.uri,
				image: item.images[0]?.url ?? "",
				selected: false,
				originalSelected: false,
			}
		})

		setKnownPlaylistCount(own_playlists.length)

		for (const playlist of own_playlists) {
			const isInPlaylist = await isTrackInPlaylist(playlist.uri);
		
			console.log(playlist.name)

			playlist.selected = isInPlaylist;
			playlist.originalSelected = isInPlaylist;
		}

		if (playlists.length > 0) return; // only when we have pressed on a playlist will we willingly clear
		
		const likedPlaylist = {
			name: "Liked Songs",
			uri: "liked_songs",
			image: "",
			selected: false,
			originalSelected: false
		}

		// check if liked
		const isLiked = await isLikedTrack()
		likedPlaylist.selected = isLiked
		likedPlaylist.originalSelected = isLiked

		// add playlists and display
		own_playlists = [likedPlaylist, ...own_playlists]
		setPlaylists(own_playlists);
	}

	const togglePlaylistSelection = (playlistUri: string) => {
		setPlaylists(playlists.map(playlist => {
			if (playlist.uri === playlistUri) {
				playlist.selected = !playlist.selected;
			}
			return playlist;
		}));
	};

	const addCurrentTrackToPlaylist = async (playlistUri: string) => {
		const currentUri = currentTrack?.metadata?.item?.uri

		if (currentUri) {
			// TODO: check if in playlist already
			if (playlistUri === "liked_songs") {
				await Spicetify.Platform.LibraryAPI.add({uris: [currentUri]})
				return
			}

			// not in playlist; add to playlist
			await Spicetify.Platform.PlaylistAPI.add(
				playlistUri, 
				[ // tracks to add
					currentUri
				],
				{ // options
					after: "end"
				}
			)
		}
	}

	const removeCurrentTrackFromPlaylist = async (playlistUri: string) => {
		const currentUri = currentTrack?.metadata?.item?.uri;
		if (currentUri) {
			if (playlistUri === "liked_songs") {
				await Spicetify.Platform.LibraryAPI.remove({uris: [currentUri]})
				return
			}

			// for some reason this only works if uid is blank? if this breaks, uid is in currentTrack 
			await Spicetify.Platform.PlaylistAPI.remove(
				playlistUri,
				[
					{
						uri: currentUri,
						uid: ""
					}
				]
			);
		}
	};

	const handleDone = () => {
		playlists.forEach((playlist) => {
			// Add if newly selected
			if (playlist.selected && !playlist.originalSelected) {
				console.log(`Adding to ${playlist.name}`);
				addCurrentTrackToPlaylist(playlist.uri);
			}
			// Remove if unselected (and it was originally selected)
			if (!playlist.selected && playlist.originalSelected) {
				console.log(`Removing from ${playlist.name}`);
				removeCurrentTrackFromPlaylist(playlist.uri);
			}
		});

		setPlaylists([])
		setShowPlaylistMenu(false);
	};

	const handleCancel = () => {
		setPlaylists([])
		setShowPlaylistMenu(false);
	};

	useEffect(() => {
		console.log("isenabled =", isEnabled)
		const root = GetState("fadRoot")
		if (!root) return

		if (isEnabled) {
			// enable with ~effects~
			console.log("enable")
			document.body.classList.add("fad-active")
		} else {
			// disable with ~effects~
			console.log("remove")
			document.body.classList.remove("fad-active")
			ReactDOM.unmountComponentAtNode(root)
		}
	}, [isEnabled])

	useEffect(() => {
		if (artistArt) {
			console.log("[LMC] update to artist art getting lumi values")
			WebAPI.colorExtractor(artistArt)
				.then(color => {
					setBgColor(color?.DARK_VIBRANT ?? "#000000")
					const bgType = config?.bgType === "STATIC" ? bgColor : (config?.bgType === "ALBUM" ? currentTrack?.metadata.item.metadata.image_xlarge_url : artistArt);
	
					setDarkMode(getLuminance(bgColor) < LUMINANCE_TOLERANCE ? true : false)
				})
				.catch(err => console.error(err));
		}
	}, [artistArt])

	useEffect(() => {
		if (config?.bgType === "ARTIST") {
			WebAPI.getArtistArt(currentTrack?.metadata?.item?.metadata).then((art) => {
				setArtistArt(art)
			})
		}
    }, [isEnabled, currentTrack, config?.bgType]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (isPlaying && !dragging) {
				const progress = Spicetify.Player.getProgress();
				const duration = Spicetify.Player.getDuration();
				setProgress((progress / duration) * 100);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isEnabled, isPlaying, dragging]);

	useEffect(() => {
		console.log(`[LMS] theme ${darkMode ? "is dark" : "is light"}`)
		setTextColor(darkMode ? "#FFFFFF" : "#000000")
	}, [darkMode])

	return (
		<div id="fad-root">
			<div id="fad-bg" 
				style={{
					backgroundImage: `url(${config?.bgType === "STATIC" ? bgColor : (config?.bgType === "ALBUM" ? currentTrack?.metadata.item.metadata.image_xlarge_url : artistArt)})`,
					backgroundColor: `${bgColor}`,
					backgroundSize: `${config?.bgType === "ARTIST" ? "cover" : "contain"}`,
					backgroundPosition: `${config?.bgType === "ARTIST" ? "center" : "initial"}`,
					filter: `${config?.bgType === "STATIC" ? "none" : `blur(${config?.bgBlur ?? 0}px) contrast(0.9) brightness(0.8)`}`,
				}}
			/>

			{config?.edgeGlow && <div id="fad-overlay" style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "transparent",
				boxShadow: '0 0 200px 50px rgba(255, 255, 255, 0.5) inset',
			}} />}
			
			<div id="fad-details">
				<div id="fad-cover-container">
					<div id="fad-cover" style={{backgroundImage: `url(${currentTrack?.metadata.item.metadata.image_xlarge_url})`}}>
						{/* <SmartElement> */}
							<button
								id="fad-playlist-add"
								onClick={handlePlaylistButton}
							>
								<svg 
									role="img"
									height="20" 
									width="20" 
									viewBox="0 0 16 16" 
									fill={textColor} 
									dangerouslySetInnerHTML={{ 
									__html: Spicetify.Player.getHeart() ? 
									Spicetify.SVGIcons["check-alt-fill"] : 
									Spicetify.SVGIcons["plus-alt"]
									}}
								/>
							</button>
						{/* </SmartElement> */}

						{showPlaylistMenu && (
							<div className="playlist-menu">
								{/* Scrollable playlist list */}
								<div className="playlist-list">
									{playlists.length > 0 ? (
									playlists.map((playlist) => (
										<div
										key={playlist.uri}
										className="playlist-item"
										onClick={() => togglePlaylistSelection(playlist.uri)}
										>
										<span className="tick">{playlist.selected ? "✓" : ""}</span>
										{playlist.image ? (
											<div
											className="playlist-image"
											style={{ backgroundImage: `url(${playlist.image})` }}
											/>
										) : (
											<div className="playlist-image placeholder" />
										)}
										<span className="playlist-name">{playlist.name}</span>
										</div>
									))
									) : (
									<div>
										{Array.from({ length: knownPlaylistCount }).map((_, index) => (
										<PlaylistSkeleton key={index} />
										))}
									</div>
									)}
								</div>

								{/* Fixed footer with Cancel and Done buttons */}
								<div className="playlist-footer">
									<button className="cancel-btn" onClick={handleCancel}>
									Cancel
									</button>
									<button className="done-btn" onClick={handleDone}>
									Done
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				<div id="fad-header">
					<div id="fad-title-container">
						<div id="fad-title" style={{ 
							color: textColor,
							textAlign: 'center'
						}}>
							{currentTrack?.metadata.item?.name ?? "Missing Title?"}
						</div>

						<div id="fad-album" style={{ color: textColor }}>
							{currentTrack?.metadata.item.artists.map((artist: { name: string; }) => artist.name).join(", ") ?? "No Album?"}
						</div>

						<div id="fad-controls" style={{ padding: '10px' }}>
							<button onClick={Spicetify.Player.back}>
								<svg role="img" height="20" width="20" viewBox="0 0 16 16" fill={textColor} dangerouslySetInnerHTML={{ __html: Spicetify.SVGIcons["skip-back"] }} />
							</button>
							<button onClick={Spicetify.Player.togglePlay}>
								<svg role="img" height="20" width="20" viewBox="0 0 16 16" fill={textColor} dangerouslySetInnerHTML={{ __html: isPlaying ? Spicetify.SVGIcons["pause"] : Spicetify.SVGIcons["play"] }} />
							</button>
							<button onClick={Spicetify.Player.next}>
								<svg role="img" height="20" width="20" viewBox="0 0 16 16" fill={textColor} dangerouslySetInnerHTML={{ __html: Spicetify.SVGIcons["skip-forward"] }} />
							</button>
						</div>
						<div id="fad-progress-container" style={{ display: 'flex', width: '50%', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
							<span style={{ color: textColor, paddingBottom: '20px', width: '50px', textAlign: 'center' }}>{formatTime((progress / 100) * Spicetify.Player.getDuration() / 1000)}</span>
							<Slider
								value={progress}
								onDragging={setDragging}
								onChange={handleSliderChange}
								onChangeEnd={handleSliderChangeEnd}
								orientation="horizontal"
								trackStyle={{ backgroundColor: adjustColorBrightness(bgColor, darkMode ? 40 : -40) }}
								thumbStyle={{ backgroundColor: adjustColorBrightness(bgColor, darkMode ? 80 : -80) }}
							/>
							<span style={{ color: textColor, paddingBottom: '20px', width: '50px', textAlign: 'center' }}>{formatTime(Spicetify.Player.getDuration() / 1000)}</span>
						</div>
					</div>
				</div>
			</div>

			<SmartElement>
				<div id="fad-volume-slider" style={{ position: 'absolute', height: '200px', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
					<Slider
						value={Spicetify.Player.getMute() ? 0 : volume}
						onDragging={() => {}}
						onChange={handleVolumeChange}
						onChangeEnd={handleVolumeChangeEnd}
						orientation="vertical"
						invert={true}
						trackStyle={{ backgroundColor: adjustColorBrightness(bgColor, darkMode ? 40 : -40) }}
						thumbStyle={{ backgroundColor: adjustColorBrightness(bgColor, darkMode ? 80 : -80) }}
					/>
					<span style={{ color: textColor, position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>{Math.round(volumeDisplay)}%</span>
					<button id="fad-mute" onClick={Spicetify.Player.toggleMute}>
						<svg role="img" height="20" width="20" viewBox="0 0 16 16" fill={textColor} style={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%)' }} dangerouslySetInnerHTML={{ __html: getVolumeIcon(Spicetify.Player.getMute() ? 0 : volume) }} />
					</button>
				</div>
			</SmartElement>

			<div style={{color: textColor}} id="fad-playlist-info">
				<span>•</span> 
				<span>{currentTrack?.metadata?.context?.metadata?.context_description}</span> 
				<span>•</span>
			</div>

			{isSettingsEnabled && <FADSettings/>}
		</div>
	)
}