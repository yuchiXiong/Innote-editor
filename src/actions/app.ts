export const close = () => window.electronAPI.app.close();
export const minimize = () => window.electronAPI.app.minimize();
export const maximize = () => window.electronAPI.app.maximize();
export const unMaximize = () => window.electronAPI.app.unmaximize();
export const isMaximized = () => window.electronAPI.app.isMaximized();
