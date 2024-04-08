export const close = () => window.electronAPI.app.close();
export const minimize = () => window.electronAPI.app.minimize();
export const maximize = () => window.electronAPI.app.maximize();
export const unMaximize = () => window.electronAPI.app.unMaximize();
export const isMaximized = () => window.electronAPI.app.isMaximized();
export const onMaximized = (callback: () => void) => window.electronAPI.app.onMaximized(callback);
export const onUnMaximized = (callback: () => void) => window.electronAPI.app.onUnMaximized(callback);
