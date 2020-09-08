const format = (value, currencyLabel = true) => {
    var reverse = value.toString().split('').reverse().join(''),
        ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    if (currencyLabel) {
        return `Rp ${ribuan}`
    } else {
        return `${ribuan}`
    }
}

export default () => ({
    format
})