import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYDiWG6Ut1Lpsb2OBz2FlW4tpX3w/p75Omdi2cPn3iw9/ynQpMBilJScbGppaphimJZoYpJlZJpkYmidZmieaGpsnmZgZLDHXSmsIZGT4EdvJxMgAgSA+C4NvYmYeAwMAvFIguw=="

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";