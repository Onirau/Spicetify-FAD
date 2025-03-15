interface ColorExtracted {
    DARK_VIBRANT: string;
    DESATURATED: string;
    LIGHT_VIBRANT: string;
    VIBRANT: string;
    VIBRANT_NON_ALARMING: string;
    undefined: string;
    [key: string]: string;
}

export class WebAPI {
    private static readonly MAX_COLOR_CACHE_SIZE = 20;
    private static readonly MAX_ARTIST_INFO_CACHE_SIZE = 50;
    private static readonly MAX_ARTIST_SEARCH_CACHE_SIZE = 50;

    private static colorCache: { uri: string, colors: ColorExtracted }[] = [];
    private static artistInfoCache: Map<string, any> = new Map();
    private static artistSearchCache: Map<string, any> = new Map();


    static getToken() {
        return Spicetify.Platform.AuthorizationAPI._state.token.accessToken;
    }

    // moved from old to https://github.com/daksh2k/Spicetify-stuff/blob/7d4a6bbe50e469e80b5275992a30aff5aaf26b66/Extensions/full-screen/src/utils/utils.ts#L125
    static async getArtistArt(meta: Spicetify.Metadata) {
        console.log(meta)
        if (meta.artist_uri == null) return meta.image_xlarge_url;
        let artistUri = meta.artist_uri.split(":")[2];

        // track is local
        if (meta.artist_uri.split(":")[1] == "local") {
            const res = await WebAPI.searchForArtist(meta.artist_name ?? "").catch((err) => {
                console.warn(`[LMS] ${err}`)
            })

            artistUri = res ? res.artists.items[0].id : ""
        }

        const artistInfo = await WebAPI.getArtistInfo(artistUri).catch((err) => {
            console.warn(`[LMS] ${err}`)
        })

        const artistImage = artistInfo?.visuals?.headerImage?.sources[0].url

        if (!artistImage) {
            return artistInfo?.visuals?.avatarImage?.sources[0]?.url
        }

        return artistImage ?? meta.image_xlarge_url
    }

    static async getArtistInfo(artistID: string): Promise<any> {
        // Check if the artist info is in the cache
        if (this.artistInfoCache.has(artistID)) {
            console.log('Cache hit')
            return this.artistInfoCache.get(artistID);
        }

        const response = await fetch(
            `https://api-partner.spotify.com/pathfinder/v1/query?operationName=queryArtistOverview&variables=%7B%22uri%22%3A%22spotify%3Aartist%3A${artistID}%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22d66221ea13998b2f81883c5187d174c8646e4041d67f5b1e103bc262d447e3a0%22%7D%7D`,
            {
                headers: {
                    Authorization: `Bearer ${await WebAPI.getToken()}`,
                },
            },
        )

        const data = await response.json();
        const artistInfo = data.data.artist;

        // Add to cache and handle eviction if needed
        this.artistInfoCache.set(artistID, artistInfo);
        if (this.artistInfoCache.size > this.MAX_ARTIST_INFO_CACHE_SIZE) {
            const firstKey = this.artistInfoCache.keys().next().value;
            if (firstKey) this.artistInfoCache.delete(firstKey);
        }

        return artistInfo;
    }

    static async searchForArtist(name: string): Promise<any> {
        // Check if the search result is in the cache
        if (this.artistSearchCache.has(name)) {
            return this.artistSearchCache.get(name);
        }

        const response = await fetch(`https://api.spotify.com/v1/search?q=${name}&type=artist&limit=2`, {
            headers: {
                Authorization: `Bearer ${await WebAPI.getToken()}`,
            }
        })
        const searchResult = await response.json();

        // Add to cache and handle eviction if needed
        this.artistSearchCache.set(name, searchResult);
        if (this.artistSearchCache.size > this.MAX_ARTIST_SEARCH_CACHE_SIZE) {
            const firstKey = this.artistSearchCache.keys().next().value;
            if (firstKey) this.artistSearchCache.delete(firstKey);
        }

        return searchResult;
    }

    static async colorExtractor(uri: string): Promise<ColorExtracted | undefined> {
        const presentInCache = this.colorCache.find(item => item.uri === uri);
        if (presentInCache) return presentInCache.colors;

        const body = await Spicetify.CosmosAsync.get(
            `https://spclient.wg.spotify.com/colorextractor/v1/extract-presets?uri=${uri}&format=json`,
        );

        if (body.entries && body.entries.length) {
            const colorList: Record<string, string> = {};

            for (const color of body.entries[0].color_swatches) {
                if (Object.keys(color).length === 0) continue

                colorList[color.preset] = `#${color.color.toString(16).padStart(6, "0")}`;
            }

            if (this.colorCache.length > this.MAX_COLOR_CACHE_SIZE) this.colorCache.shift();

            this.colorCache.push({ uri, colors: colorList as ColorExtracted });
            return colorList as ColorExtracted;
        }
    }
}