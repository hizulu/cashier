<template>
  <div>
    <v-card outlined>
      <v-alert v-if="!isCloseOrder" prominent type="error">
        <v-row align="center">
          <v-col class="grow">
            Upload tidak dapat dilakukan karena belum
            <strong>BELUM CLOSE ORDER</strong>
          </v-col>
        </v-row>
      </v-alert>
      <v-container>
        <v-card-title>
          <v-row>
            <v-col cols="12" md="9">
              <div class="text-h6">Transaksi yang belum diupload ke database</div>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                :disabled="!isCloseOrder || transactions.length <= 0"
                @click="upload()"
                color="primary"
                :loading="dialog"
                block
                dense
                class="ma-2 white--text"
              >
                Upload
                <v-icon right dark>mdi-cloud-upload</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left" width="40px">No</th>
                <th class="text-left" width="400px">Nama Pelanggan</th>
                <th class="text-left">Waktu Transaksi</th>
                <th class="text-right">Jumlah Transaksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in transactions" :key="item.id">
                <td>{{ i+1 }}</td>
                <td>{{ item.customer_name }}</td>
                <td>{{ `${item.date} ${item.time}` }}</td>
                <td class="text-right">{{ formatter.format(item.total) }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-card>

    <v-dialog v-model="dialog_upload.visible" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">{{ dialog_upload.title }}</v-card-title>
        <v-card-text>{{ dialog_upload.text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog_upload.visible = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-container>
          {{ loading_text }}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import storage from "../../storage";
import firebase from "../../firebase";
import money from "../../moneyformat";
export default {
  data() {
    return {
      dialog: false,
      formatter: money(),
      complete: false,
      dialog_upload: {
        visible: false,
        title: "Upload Selesai!",
        text: "Mantap"
      },
      show_error: false,
      error_count: 0,
      loading_text: "Mengupload transaksi...",
      transactions: []
    };
  },
  mounted() {
    this.transactions = storage().getTransactions();
  },
  computed: {
    isCloseOrder() {
      return storage().getCloseOrder();
    }
  },
  methods: {
    upload() {
      if (navigator.onLine) {
        this.complete = this.show_error = false;
        this.error_count = 0;
        let total = 0;
        let id = Date.now();
        let error = 0;
        this.dialog = true;

        let errorUploadTransactions = [];
        setTimeout(() => {
          this.transactions.map(item => {
            total += item.total;
            firebase()
              .db.collection("transactions")
              .add({
                ...item,
                ...{ id: id }
              })
              .catch(function() {
                error += 1;
                errorUploadTransactions.push(item);
              });
          });
          storage().setTransactions(errorUploadTransactions);
          firebase()
            .db.collection("daily_transaction_upload")
            .add({
              total: total,
              id: id,
              date: this.$moment().format("DD-MM-YYYY")
            });

          storage().setFirebaseTransactions(
            storage()
              .getFirebaseTransactions()
              .concat(this.transactions)
          );
          this.transactions = [];
          this.error_count = error;
          this.dialog = false;
        }, 2000);
      } else {
        this.dialog_upload.visible = true;
        this.dialog_upload.title = "Anda offline!";
        this.dialog_upload.text =
          "Anda sedang offline, upload hanya bisa dilakukan saat anda online saja.";
      }
    }
  }
};
</script>