import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYLjJziz/v+XB71chJZ0Sy5mSOyOCDW49PtKYZXvn1dOgCdwKDEZpycmGhqaWKYZpiSYGaWaWSSaG5kmW5ommxuZJJmYGtnbRaQ2BjAzbt7ezMjJAIIjPwuCbmJnHwAAAeBMfmw=="

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";