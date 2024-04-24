import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYGDZ+Z1FRsVC72mN6dofN31ObL6ha6l37u3xGS681jIrPkcpMBilJScbGppaphimJZoYpJlZJpkYmidZmieaGpsnmZgZzJ2lkdYQyMgww1yIiZEBAkF8FgbfxMw8BgYAFpgeBQ=="

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";