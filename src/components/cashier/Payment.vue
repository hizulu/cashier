<template>
  <div>
    <v-dialog v-model="open" persistent max-width="450px">
      <v-card>
        <v-card-title>
          <span class="headline">Pembayaran</span>
        </v-card-title>
        <!-- <v-alert
          prominent
          text
          type="info"
        >Nota akan otomatis tercetak ketika anda selesai mengisi uang tunai pembayaran</v-alert>-->
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <div class>TOTAL</div>
            </v-col>
            <v-col cols="12" md="4" class="text-right text-h6">{{ mf.format(total) }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8">
              <div class>TUNAI</div>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                ref="payment"
                v-model="value"
                type="number"
                @keyup.enter="doPay()"
                label="Rp"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8">
              <div class>KEMBALI</div>
            </v-col>
            <v-col cols="12" md="4" class="text-right text-h6">{{ mf.format(moneyreturn) }}</v-col>
          </v-row>
          <v-checkbox v-model="print" label="Cetak nota setelah bayar"></v-checkbox>
          <hr />
          <v-row>
            <v-col cols="12" md="4">
              Status printer:
              <div v-if="printerStatus" class="text-h6">READY</div>
              <div v-else class="text-h6">ERROR</div>
            </v-col>
            <v-col cols="12" md="8">
              <v-btn color="info" small @click="checkPrinterStatus()">Refresh</v-btn>
              <v-btn color="info" class="ml-1" small @click="testPrint()">test print</v-btn>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="$emit('close')">BATAL</v-btn>
          <v-btn color="blue darken-1" text @click="doPay()">bayar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      :timeout="notification.timeout"
      v-model="notification.visible"
      fixed
      centered
      :color="notification.color"
      elevation="24"
    >
      {{ notification.text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="notification.visible = false">tutup</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import printer from "../../printer";
import money from "../../moneyformat";
import storage from "../../storage";

export default {
  props: ["open", "total"],
  data() {
    return {
      mf: money(),
      print: true,
      printerStatus: false,
      value: null,
      moneyreturn: 0,
      notification: {
        visible: false,
        text: "",
        color: "red",
        timeout: 1500
      }
    };
  },
  watch: {
    open() {
      if (this.open) {
        this.checkPrinterStatus();
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.payment.focus();
          });
        }, 100);
      }
    },
    value() {
      if (this.value >= this.total) {
        this.moneyreturn = this.value - this.total;
      }
    }
  },
  methods: {
    checkPrinterStatus() {
      printer().check(
        () => {
          this.printerStatus = false;
        },
        () => {
          this.printerStatus = true;
        }
      );
    },
    testPrint() {
      printer().test();
    },
    doPay(reprint = false) {
      //   validate input
      if (reprint) {
        let obj = {
          ...storage().getCurrentTransaction(),
          ...{ stash: storage().getStash() },
          ...{ sauces: storage().getSauces() },
          total: this.total
        };
        printer().print(obj);
      } else {
        if (this.value < this.total) {
          this.notification.visible = false;
          this.notification.visible = true;
          this.notification.text = "Uang tunai kurang untuk membayar tagihan.";
        } else {
          //   masukkan status dibayar
          let payment = {
            paid: parseInt(this.value),
            moneyreturn: parseInt(this.value) - parseInt(this.total)
          };

          let currentTransaction = storage().getCurrentTransaction();
          let paidTransaction = {
            ...payment,
            date: this.$moment()
              .locale("id")
              .format("DD-MM-YYYY"),
            time: this.$moment()
              .locale("id")
              .format("H:mm"),
            ...{
              customer_name: currentTransaction.customer_name,
              table_number: currentTransaction.table_number,
              stash: currentTransaction.stash || storage().getStash(),
              sauces: currentTransaction.sauces || storage().getSauces(),
              id: currentTransaction.id ? currentTransaction.id : Date.now(),
              total: currentTransaction.total || this.total
            }
          };
          storage().setCurrentTransaction(paidTransaction);

          let transactions = storage().getTransactions();
          for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].id == paidTransaction.id) {
              transactions.splice(i, 1);
              break;
            }
          }
          transactions.unshift(paidTransaction);
          storage().setTransactions(transactions);
          let obj = {
            ...storage().getCurrentTransaction(),
            ...{ stash: storage().getStash() },
            ...{ sauces: storage().getSauces() },
            total: this.total
          };
          // console.log(obj);
          // alert(`${obj}`);
          if (this.print) {
            printer().print(obj);
          }

          this.$emit("paymentconfirm");
        }
      }
    }
  }
};
</script>