import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYFipXJb/2/j9G+262TzbZ384sulXRML1/d27smTVo18JGz1RYDBKS042NDS1TDFMSzQxSDOzTDIxNE+yNE80NTZPMjEzWLfoR2pDICOD/8l7DIxQCOJzMqQX5ZcWJCfm5DAwAAC7dSRY"

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "groupcall";