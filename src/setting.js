import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYBD7uMb/xZOpJzf2Lv9eV1u16bTD3I2rZ4QJz1GuSkuJ38mhwGCUlpxsaGhqmWKYlmhikGZmmWRiaJ5kaZ5oamyeZGJm4HdcLa0hkJFB/OknRkYGCATxWRh8EzPzGBgA82gg6A=="

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";