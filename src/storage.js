const LAST_DOWNLOAD_MENU_KEY = 'last_download_menu'
const DARK_MODE_KEY = 'dark_mode'
const MENUS_KEY = 'menus'

const getLastDownloadMenu = () => {
    return localStorage.getItem(LAST_DOWNLOAD_MENU_KEY)
}
const setLastDownloadMenu = (value) => {
    localStorage.setItem(LAST_DOWNLOAD_MENU_KEY, value)
}
// 
const getMenus = () => {
    let value = localStorage.getItem(MENUS_KEY)
    return (value == null) ? [] : JSON.parse(value)
}
const setMenus = (value) => {
    localStorage.setItem(MENUS_KEY, value)
}
// 
const getDarkModeStatus = () => {
    let value = localStorage.getItem(DARK_MODE_KEY)
    if (value == null || value == 'false') {
        return false
    }
    return true
}

const setDarkModeStatus = (value) => {
    localStorage.setItem(DARK_MODE_KEY, value)
    return true
}

export default () => ({
    getLastDownloadMenu,
    getDarkModeStatus,
    setDarkModeStatus,
    setLastDownloadMenu,
    getMenus,
    setMenus
})