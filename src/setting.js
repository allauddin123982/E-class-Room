import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYAg889WuOP91WMX1d9tDWc/+OZ2vIex++lHIiVYHa5Mrr20UGIzSkpMNDU0tUwzTEk0M0swsk0wMzZMszRNNjc2TTMwMDEMl0hoCGRl+zF7CxMgAgSA+C4NvYmYeAwMAzRAgfA=="

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";