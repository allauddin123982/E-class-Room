import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYEhmmb944bqTclfe1Bec9Uk8vG42W+/bhJ3Lg97flRLcqvtIgcEoLTnZ0NDUMsUwLdHEIM3MMsnE0DzJ0jzR1Ng8ycTMoNtJPq0hkJFBvl+bgREKQXwWBt/EzDwGBgC2iR+N"

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";