const format = (value) => {
    var reverse = value.toString().split('').reverse().join(''),
        ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return `Rp ${ribuan}`
}

export default () => ({
    format
})