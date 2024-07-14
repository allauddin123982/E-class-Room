import {createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2fcc1159d1fa40f69b417b97a537b460"
const token = "007eJxTYLj0/9G277/Pn5VkEYp9H37m2KL3YQxWtT6MLvXXFLjaBS4rMBilJScbGppaphimJZoYpJlZJpkYmidZmieaGpsnmZgZ2O6ZnNYQyMhwZ4E3AyMUgvgsDL6JmXkMDADA2iAt"

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";