<template>
  <div>
    <v-card outlined>
      <v-container>
        <v-card-title>
          Total Transaksi hari ini:
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="transactions"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-if="transactions.length <= 0" v-slot:no-data>Tidak ada pesanan</template>
          <template v-else v-slot:body="{ items }">
            <tbody>
              <tr v-for="(item, i) in items" :key="item.id">
                <td>{{ i+1 }}</td>
                <td>
                  <router-link :to="`/kasir?index=${i}&id=${item.id}`">{{ item.customer_name }}</router-link>
                </td>
                <td class="text-center">{{ item.table_number }}</td>
                <td class="text-right">{{ money.format(item.paid) }}</td>
                <td class="text-center">{{ `${item.date} ${item.time}` }}</td>
                <td class="text-right">{{ money.format(item.total) }}</td>
                <td class="text-center">
                  <!-- <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon> -->
                  <v-icon small @click="del(i)">mdi-delete</v-icon>
                </td>
              </tr>
            </tbody>
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
          sortable: false
        },
        { text: "Nama Pelanggan", value: "calories" },
        { text: "No Meja", align: "center", value: "fat" },
        { text: "Dibayar", align: "center", value: "carbs" },
        { text: "Tgl Waktu", align: "center", value: "protein" },
        { text: "Total", align: "center" },
        { text: "Aksi", align: "center", value: "actions", sortable: false }
      ],
      transactions: []
    };
  },
  mounted() {
    this.transactions = storage().getTransactions();
  },
  methods: {
    del(index, confirm = false) {
      if (confirm) {
        this.transactions.splice(index, 1);
        storage().setTransactions(this.transactions);
        this.dlt_dialog.visible = false;
      }
      this.dlt_dialog.name = this.transactions[index].customer_name;
      this.dlt_dialog.visible = true;
      this.dlt_dialog.index = index;
    }
  }
};
</script>