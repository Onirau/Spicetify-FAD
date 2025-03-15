!async function(){for(;!Spicetify.React||!Spicetify.ReactDOM;)await new Promise(e=>setTimeout(e,10));(()=>{var r=Object.create,c=Object.defineProperty,s=Object.getOwnPropertyDescriptor,d=Object.getOwnPropertyNames,i=Object.getOwnPropertySymbols,u=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable,o=(e,t,a)=>t in e?c(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,p=(e,t)=>{for(var a in t=t||{})f.call(t,a)&&o(e,a,t[a]);if(i)for(var a of i(t))n.call(t,a)&&o(e,a,t[a]);return e},e=(e,t)=>function(){return t||(0,e[d(e)[0]])((t={exports:{}}).exports,t),t.exports},t=(e,t,a)=>{a=null!=e?r(u(e)):{};var i=!t&&e&&e.__esModule?a:c(a,"default",{value:e,enumerable:!0}),n=e,o=void 0,l=void 0;if(n&&"object"==typeof n||"function"==typeof n)for(let e of d(n))f.call(i,e)||e===o||c(i,e,{get:()=>n[e],enumerable:!(l=s(n,e))||l.enumerable});return i},a=e({"external-global-plugin:react"(e,t){t.exports=Spicetify.React}}),e=e({"external-global-plugin:react-dom"(e,t){t.exports=Spicetify.ReactDOM}}),y={onStartUp:!1,canFullscreen:!1,localeID:"en"};var g=t(a()),m=t(e()),S=t(a()),b=t(e()),l=t(a()),h={isPlaying:!1,isFullscreen:!1,isEnabled:!1,locale_id:"en",fadRoot:void 0,fadButton:void 0,volumeLevel:0,currentTrack:void 0,nextTrack:void 0},v=class{constructor(){this.currentState=h,this.listeners={}}static getInstance(){return v.instance||(v.instance=new v),v.instance}getState(e){return this.currentState[e]}notifySubscriptions(e){this.listeners[e]&&this.listeners[e].forEach(e=>e())}dispatchAction(e){switch(e.type){case"SET_PLAYING":this.currentState.isPlaying=e.payload,this.notifySubscriptions("isPlaying");break;case"SET_FULLSCREEN":this.currentState.isFullscreen=e.payload,this.notifySubscriptions("isFullscreen");break;case"SET_ENABLED":this.currentState.isEnabled=e.payload,this.notifySubscriptions("isEnabled");break;case"SET_ROOT":this.currentState.fadRoot=e.payload,this.notifySubscriptions("fadRoot");break;case"SET_FADBUTTON":this.currentState.fadButton=e.payload,this.notifySubscriptions("fadButton");break;case"SET_VOLUMELEVEL":this.currentState.volumeLevel=e.payload,this.notifySubscriptions("volumeLevel");break;case"SET_LOCALE":this.currentState.locale_id=e.payload,this.notifySubscriptions("locale_id");break;case"SET_CURRENTTRACK":this.currentState.currentTrack=e.payload,this.notifySubscriptions("currentTrack");break;case"SET_NEXTTRACK":this.currentState.nextTrack=e.payload,this.notifySubscriptions("nextTrack")}}subscribeState(e,t){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t)}unsubscribeState(e,t){this.listeners[e]&&(this.listeners[e]=this.listeners[e].filter(e=>e!==t))}};function E(e){return v.getInstance().dispatchAction(e)}function T(e){return v.getInstance().getState(e)}function L(t){let a=v.getInstance(),[e,i]=(0,l.useState)(a.getState(t));return(0,l.useEffect)(()=>{let e=()=>{i(a.getState(t))};return a.subscribeState(t,e),()=>{a.unsubscribeState(t,e)}},[t,a]),e}function w(t,a){let i=v.getInstance(),e=()=>{var e=i.getState(t);a(e)};i.subscribeState(t,e)}var{}=Spicetify.ReactFlipToolkit;function P(){let e,t,a,i,n,o=L("isEnabled");L("isPlaying");var l=L("currentTrack");return(0,S.useEffect)(()=>{console.log("isenabled =",o);var e=T("fadRoot");e&&(o?(console.log("enable"),document.body.classList.add("fad-active")):(console.log("remove"),document.body.classList.remove("fad-active"),b.default.unmountComponentAtNode(e)))},[o]),console.log(l),S.default.createElement("div",{id:"fad-root"},S.default.createElement("div",{id:"fad-bg",style:{backgroundImage:"url()"}}),S.default.createElement("div",{id:"fad-details"},S.default.createElement("div",{id:"fad-cover-container"},S.default.createElement("div",{id:"fad-cover",style:{backgroundImage:`url(${null==l?void 0:l.metadata.item.metadata.image_xlarge_url})`}})),S.default.createElement("div",{id:"fad-header"},S.default.createElement("div",{id:"fad-title-container"},S.default.createElement("div",{id:"fad-title"},null!=(t=null==(e=null==l?void 0:l.metadata.item)?void 0:e.name)?t:"Missing Title?"),S.default.createElement("div",{id:"fad-album"},null!=(n=null==(i=null==(a=null==l?void 0:l.metadata.item)?void 0:a.album)?void 0:i.name)?n:"No Album?")))))}var k={en:{langName:"English",strings:{actions:{},description:{fullscreen:"Fullscreen Display"}}},es:{langName:"Spanish",strings:{actions:{},description:{fullscreen:"WWW"}}}},_=e=>{var t,a=T("locale_id"),i=e.split(".");let n=k[a].strings;console.log(n);for(t of i)if(console.log(t),n=n[t],console.log(n),void 0===n)return e;return n||e};var O=async function(){for(;!(Spicetify&&Spicetify.Keyboard&&Spicetify.React&&Spicetify.ReactDOM&&Spicetify.Platform&&Spicetify.Platform.PlaybackAPI&&Spicetify.Platform.PlaybackAPI._isAvailable&&Spicetify.showNotification);)await new Promise(e=>setTimeout(e,100));class e extends g.default.Component{constructor(e){super(e),this.handleFullscreenChange=()=>{document.fullscreenElement||n()},this.mouseTrap=new Spicetify.Mousetrap}componentDidMount(){document.addEventListener("fullscreenchange",this.handleFullscreenChange)}componentWillUnmount(){document.removeEventListener("fullscreenchange",this.handleFullscreenChange)}render(){return g.default.createElement("div",{id:"fad-display-container"},g.default.createElement(P,null))}}let t=function(){try{var e=Spicetify.LocalStorage.get("lmn-config-fad");if(e)return p(p({},y),JSON.parse(e))||y;throw""}catch(e){return y}}();async function a(){T("isEnabled")&&t.canFullscreen?(console.log("req full"),await document.documentElement.requestFullscreen()):(console.log("exit full"),await document.exitFullscreen())}async function i(){console.log("[LMS] FAD ACTIVE REQ!"),document.body.classList.contains("fad-active")||(E({type:"SET_ENABLED",payload:!0}),m.default.render(g.default.createElement(e),o),await a())}async function n(){console.log("[LMS] FAD REMOVE REQ!"),document.body.classList.contains("fad-active")&&(E({type:"SET_ENABLED",payload:!1}),await a())}let o=document.createElement("div");function l(){var e=Spicetify.Player.data;if(!e)return setTimeout(()=>{l()},500);e={duration:e.duration,progress:0,metadata:e};E({type:"SET_CURRENTTRACK",payload:e}),console.log(e)}o.id="fad-root",document.body.appendChild(o),console.log("setting root to",o),E({type:"SET_ROOT",payload:o}),document.getElementById("fad-root")?(Spicetify.showNotification("[LMS] Root loaded!"),Spicetify.showNotification("[LMS] Required Modules Loaded!"),console.log("[LMS] CUHS"),w("locale_id",()=>{var e=T("fadButton");e?e.label=_("description.fullscreen"):E({type:"SET_FADBUTTON",payload:new Spicetify.Topbar.Button(_("description.fullscreen"),`<svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">${Spicetify.SVGIcons.fullscreen}</svg>`,i)})}),Spicetify.Player.addEventListener("onplaypause",()=>E({type:"SET_PLAYING",payload:Spicetify.Player.isPlaying()})),Spicetify.Player.addEventListener("songchange",()=>l()),Spicetify.Platform.PlaybackAPI._events.addListener("volume",e=>E({type:"SET_VOLUMELEVEL",payload:e.data.volume})),E({type:"SET_PLAYING",payload:Spicetify.Player.isPlaying()}),E({type:"SET_VOLUMELEVEL",payload:Spicetify.Player.getVolume()}),E({type:"SET_LOCALE",payload:t.localeID}),w("volumeLevel",e=>{console.log("volume =>",e)}),l(),Spicetify.Mousetrap.bind("g",function(){(document.body.classList.contains("fad-active")?n:i)()}),console.log("test"),(t.onStartUp?i:n)()):Spicetify.showNotification("[LMS] Root failed!",!0)};(async()=>{await O()})()})();(async()=>{var e;document.getElementById("testDapp")||((e=document.createElement("style")).id="testDapp",e.textContent=String.raw`
  #fad-display-container{width:100%;height:100%;position:fixed;left:0;top:0;cursor:default;background-color:grey}#fad-details{width:100%;height:100%;position:fixed;left:0;top:20%}#fad-header{width:100%;height:auto;position:relative;background-color:transparent}#fad-title-container{width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:50px}#fad-cover-container{width:100%;display:flex;justify-content:center;align-items:center;background-color:transparent}#fad-cover{width:55%;max-width:450px;aspect-ratio:1;background-color:#8a2be2;background-size:cover;border-radius:4%}#fad-album,#fad-title{letter-spacing:.25px;font-weight:700;color:#000;margin:0;padding:0}#fad-title{font-size:4vw;padding-bottom:15px}#fad-album{font-size:2vw;font-weight:lighter}#fad-bg{width:100%;height:100%;position:fixed;left:0;top:0;background-size:cover;background-color:#7fffd4}.playing{background-color:green}.paused{background-color:#00f}
      `.trim(),document.head.appendChild(e))})()}();