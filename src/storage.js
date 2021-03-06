const LAST_DOWNLOAD_MENU_KEY = 'last_download_menu'
const LAST_CLOSE_ORDER_KEY = 'last_close_order'
const DARK_MODE_KEY = 'dark_mode'
const MENUS_KEY = 'menus'
const STASH_KEY = 'stash'
const TRANSACTOINS_KEY = 'transactions'
const CURRENT_TRANSACTION_KEY = 'current_transaction'
const SAUCES_KEY = 'sauces'
const CLOSE_ORDER_KEY = 'close_order'
const FIREBASE_TRANSACTIONS_KEY = 'firebase_transaction'

// 
const getFirebaseTransactions = () => {
    let value = localStorage.getItem(FIREBASE_TRANSACTIONS_KEY)
    return (value == null) ? [] : JSON.parse(value)
}
const setFirebaseTransactions = (value) => {
    localStorage.setItem(FIREBASE_TRANSACTIONS_KEY, JSON.stringify(value))
}
// 

const getCloseOrder = () => {
    let value = localStorage.getItem(CLOSE_ORDER_KEY)
    if (value == null || value == 'false') {
        return false
    }
    return true
}

const setCloseOrder = (value) => {
    localStorage.setItem(CLOSE_ORDER_KEY, value)
    return true
}

// const CUSTOMER_INFO = ' '
const getLastDownloadMenu = () => {
    return localStorage.getItem(LAST_DOWNLOAD_MENU_KEY)
}
const setLastDownloadMenu = (value) => {
    localStorage.setItem(LAST_DOWNLOAD_MENU_KEY, value)
}
//
// 
const getLastCloseOrder = () => {
    return localStorage.getItem(LAST_CLOSE_ORDER_KEY)
}
const setLastCloseOrder = (value) => {
    localStorage.setItem(LAST_CLOSE_ORDER_KEY, value)
}
// 
const getSauces = () => {
    let value = localStorage.getItem(SAUCES_KEY)
    return (value == null) ? [] : JSON.parse(value)
}
const setSauces = (value) => {
    localStorage.setItem(SAUCES_KEY, JSON.stringify(value))
}
// 

// 
const getCurrentTransaction = () => {
    let value = localStorage.getItem(CURRENT_TRANSACTION_KEY)
    return (value == null) ? {} : JSON.parse(value)
}
const setCurrentTransaction = (value) => {
    localStorage.setItem(CURRENT_TRANSACTION_KEY, JSON.stringify(value))
}
// 
// 
const getTransactions = () => {
    let value = localStorage.getItem(TRANSACTOINS_KEY)
    return (value == null) ? [] : JSON.parse(value)
}
const setTransactions = (value) => {
    localStorage.setItem(TRANSACTOINS_KEY, JSON.stringify(value))
}

const pushTransaction = (value) => {
    let transactions = getTransactions()
    transactions.unshift(value)
    setTransactions(transactions)
}
// 
// 
const getMenus = () => {
    let value = localStorage.getItem(MENUS_KEY)
    return (value == null) ? [] : JSON.parse(value)
}
const setMenus = (value) => {
    localStorage.setItem(MENUS_KEY, value)
}
// 
// 
const getStash = () => {
    let value = localStorage.getItem(STASH_KEY)
    return (value == null) ? [] : JSON.parse(value)
}
const setStash = (value) => {
    localStorage.setItem(STASH_KEY, JSON.stringify(value))
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
    setMenus,
    getStash,
    setStash,
    getTransactions,
    setTransactions,
    pushTransaction,
    getCurrentTransaction,
    setCurrentTransaction,
    getSauces,
    setSauces,
    getLastCloseOrder,
    setLastCloseOrder,
    getCloseOrder,
    setCloseOrder,
    getFirebaseTransactions,
    setFirebaseTransactions
})