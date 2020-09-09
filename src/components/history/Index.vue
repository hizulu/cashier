<template>
  <div>
    <v-card outlined>
      <v-container>
        <v-card-title>
          <v-row>
            <v-col cols="12" md="5">
              <p>Total transaksi: {{ money.format(summary.total) }}</p>
              <p>Total transaksi lunas: {{ money.format(summary.paid) }}</p>
            </v-col>
            <v-col cols="12" md="7">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-title>
        <v-data-table :search="search" :headers="headers" :items="items" class="elevation-1">
          <template v-if="transactions.length <= 0" v-slot:no-data>Tidak ada pesanan</template>
          <template v-slot:item.customer_name="{ item }">
            <router-link :to="`/kasir?index=${item.i-1}`">{{ item.customer_name }}</router-link>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon v-if="item.paid < item.total" small @click="del(item.i-1)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-container>
    </v-card>

    <template>
      <v-row justify="center">
        <v-dialog v-model="dlt_dialog.visible" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">{{ `Hapus pesanan dari '${dlt_dialog.name}'?` }}</v-card-title>
            <v-card-text>Pesanan yang sudah dihapus tidak bisa dikembalikan lagi</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="info darken-1" text @click="dlt_dialog.visible = false">batal</v-btn>
              <v-btn color="red darken-1" text @click="del(dlt_dialog.index, true)">Hapus</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script>
import storage from "../../storage";
import moneyformat from "../../moneyformat";
export default {
  data() {
    return {
      search: "",
      money: moneyformat(),
      dlt_dialog: {
        visible: false,
        index: 0,
        name: ""
      },
      headers: [
        {
          text: "No",
          align: "start",
          sortable: false,
          value: "i"
        },
        { text: "Nama Pelanggan", value: "customer_name" },
        { text: "No Meja", align: "center", value: "table_number" },
        { text: "Tgl Waktu", align: "center", value: "datetime" },
        { text: "Total", align: "center", value: "total" },
        { text: "Dibayar", align: "center", value: "paid" },
        { text: "Kembalian", align: "center", value: "moneyreturn" },
        { text: "Aksi", align: "center", value: "actions", sortable: false }
      ],
      transactions: [],
      summary: {
        total: 0,
        paid: 0
      }
    };
  },
  computed: {
    items() {
      return this.transactions.map((item, i) => {
        return {
          i: i + 1,
          id: item.id,
          customer_name: item.customer_name,
          table_number: item.table_number,
          datetime: `${item.date} ${item.time}`,
          total: moneyformat().format(item.total),
          paid: moneyformat().format(item.paid),
          moneyreturn: moneyformat().format(item.paid - item.total)
        };
      });
    }
  },
  mounted() {
    this.transactions = storage().getTransactions();
    this.countAll();
  },
  methods: {
    del(index, confirm = false) {
      if (confirm) {
        this.transactions.splice(index, 1);
        storage().setTransactions(this.transactions);
        this.dlt_dialog.visible = false;
        this.countAll();
      } else {
        this.dlt_dialog.name = this.transactions[index].customer_name;
        this.dlt_dialog.visible = true;
        this.dlt_dialog.index = index;
      }

      // this.countAll();
    },
    countAll() {
      this.summary.total = 0;
      this.summary.paid = 0;

      this.transactions.map(item => {
        this.summary.total += item.total;
        if (item.paid >= item.total) {
          this.summary.paid += item.total;
        }
      });
    }
  }
};
</script>