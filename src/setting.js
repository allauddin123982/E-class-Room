import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYJjpmf2hKy/r6ubD/+bwT5zpZe++NXHZmovvLTn9NUs/+tUqMBilJScbGppaphimJZoYpJlZJpkYmidZmieaGpsnmZgZHCpWTWsIZGSY1fGbkZEBAkF8FgbfxMw8BgYAsKwgfw=="

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";