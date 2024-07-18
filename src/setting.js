import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460";
const token =
  "007eJxTYGDKFp2WErZwmoEV6/7H2/5896wWebZvXoHM/d0yXGVSDiwKDEZpycmGhqaWKYZpiSYGaWaWSSaG5kmW5ommxuZJJmYGT/5PT2sIZGQ4OK2ImZEBAkF8FgbfxMw8BgYA6useqg==";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";
