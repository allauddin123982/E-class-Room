import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYPhzx+SozNQ6l3srH297nOItkn8uic90vWvXy7/TGxz/rpdQYDBKS042NDS1TDFMSzQxSDOzTDIxNE+yNE80NTZPMjEzCH84Ja0hkJGhz9aThZEBAkF8FgbfxMw8BgYA4v8gtw=="

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";