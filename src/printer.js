import Recta from "recta";
import moneyformat from './moneyformat'
var printer = null

const init = () => {
    printer = new Recta("cafemomon", "1811");
}

const check = (onerror, onsuccess) => {
    printer = new Recta("cafemomon", "1811");
    printer.open().then(onsuccess()).catch(() => {
        onerror()
    });
}
const print = (obj) => {
    init()
    printer.open().then(() => {
        header()
        custominfo(obj)
        for (let i = 0; i < obj.stash.length; i++) {
            item(obj.stash[i])
        }
        total(obj)
        footer()
        doPrint()
    })
    // printer.open().then(command()).catch(() => {
    //     alert("Printer Error, pastikan sudah terhubung dengan laptop dan menyalakan Recta Host")
    // })
}

const test = () => {
    init()
    printer.open().then(() => {
        printer.align("center")
            .text("CAFE MOMON CANDIDAS")
            .text("Test print")
            .cut()
            .print()
    }).catch(() => {
        alert("Printer Error, pastikan sudah terhubung dengan laptop dan menyalakan Recta Host")
    })
}

const header = () => {
    printer.reset().align('center')
        .bold(true)
        .text('CAFE MOMON CANDIDASA')
        .bold(false)
        .text('Jln Raya Candidasa No.99')
        .text("Karangasem Bali")
        .text('IG: cafemomoncandidasa')
        .text("FB: Cafemomoncandidasa")
        .text('Telp: +6281353899660')
        .text("---------------------")
        // .bold(true)
        .feed(1)
}

const custominfo = (obj) => {
    printer.align('left')
        .text(`${obj.date} ${obj.time}`)
        .text(`Pel. : ${obj.customer_name || '-'}`)
        .text(`Meja : ${obj.table_number || '-'}`)
        .text("--------------------------------")

    if (obj.sauces && obj.sauces.length > 0) {
        printer.text(obj.sauces.toString())
            .text("--------------------------------")
    }

}

const item = (item) => {
    printer.align('left')
        .text(item.name)
        .align('right')
        .text(`${item.price} x${item.qty} = ${moneyformat().format(item.total, false)}`)
}

const spacer = (money) => {
    let maxLength = 9
    let moneyLen = money.length
    let space = ''
    for (let i = 0; i < maxLength - moneyLen; i++) {
        space += ' '
    }
    return `${space}${money}`
}
const total = (obj) => {
    printer
        .align("center")
        .text("--------------------------------")
        .align('right')
        .text(`TOTAL   :${spacer(moneyformat().format(obj.total || 0, false))}`)
        .text(`TUNAI   :${spacer(moneyformat().format(obj.paid || 0, false))}`)
        .text(`KEMBALI :${spacer(moneyformat().format(obj.moneyreturn || 0, false))}`)
        .align("center")
        .text("--------------------------------")
}

const doPrint = () => {
    printer.cut().print()
}

const footer = () => {
    printer.reset().align('center')
        .text('Terimakasih.')
        .text('Sampai jumpa lagi ya!')
}

export default () => ({
    init,
    print,
    header,
    footer,
    custominfo,
    item,
    total,
    doPrint,
    check,
    test
})