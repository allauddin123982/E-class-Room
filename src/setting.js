import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYFh2bqNki0bnpuDpfV/Wsa7wnHkn8+V8p8hpx3Ru2hiUFfYoMBilJScbGppaphimJZoYpJlZJpkYmidZmieaGpsnmZgZ3AyNTGsIZGT4MLOZkZEBAkF8FgbfxMw8BgYAopMgcQ=="

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";