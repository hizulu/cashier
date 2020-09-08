<template>
  <div>
    <v-alert prominent type="error" v-if="menus.length <= 0">
      <v-row align="center">
        <v-col class="grow">Menu belum didownload, silakan tekan tombol untuk mendownload menu</v-col>
        <v-col class="shrink">
          <v-btn :to="'/'">Download menu</v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-card outlined>
      <v-container>
        <div class="mb-2">{{ currentDate }}</div>

        <v-row>
          <v-col cols="12" sm="4">
            <div class="text-h6">Pencarian Menu</div>
            <hr />
            <br />
            <v-text-field
              ref="filter"
              @keyup.enter="inputMenu()"
              label="Barcode atau nama menu"
              v-model="filter"
              outlined
              dense
              clearable
            ></v-text-field>
            <v-card outlined>
              <v-subheader>Hasil pencarian menu</v-subheader>
              <v-list dense>
                <v-list-item-group color="primary">
                  <v-list-item
                    v-for="(menu, i) in menu_section.filter_result"
                    :key="i"
                    @click="inputMenu(i)"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        v-html="`${(menu.barcode) ? menu.barcode : '-'} ${menu.name}`"
                      ></v-list-item-title>
                      <v-list-item-subtitle v-html="moneyformatter.format(menu.price)"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" sm="8">
            <div class="text-h6">Rincian Pesanan</div>
            <hr />
            <br />
            <!-- informasi pembeli -->
            <customer-info ref="cinfo"></customer-info>
            <!-- informasi pembeli -->

            <!-- summary pesanan -->
            <v-row>
              <v-col cols="12" md="9">
                <div>
                  <v-btn
                    v-if="transaction_info.stash.length > 0"
                    @click="clearStash()"
                    class="ma-2"
                    depressed
                    small
                    tile
                    outlined
                    color="error"
                    dark
                  >
                    <v-icon left>mdi-delete</v-icon>clear
                  </v-btn>
                  <v-btn
                    v-if="transaction_info.paid > 0"
                    @click="print"
                    class="ma-2"
                    depressed
                    small
                    tile
                    outlined
                    color="primary"
                    dark
                  >
                    <v-icon left>mdi-printer</v-icon>cetak
                  </v-btn>
                  <v-btn
                    v-if="transaction_info.stash.length > 0"
                    @click="checkout()"
                    class="ma-2"
                    outlined
                    depressed
                    small
                    tile
                    color="primary"
                    dark
                  >
                    <v-icon left>mdi-currency-usd</v-icon>bayar nanti
                  </v-btn>
                  <v-btn
                    v-if="transaction_info.stash.length > 0"
                    @click="pay()"
                    class="ma-2"
                    depressed
                    small
                    tile
                    color="primary"
                    dark
                  >
                    <v-icon left>mdi-currency-usd</v-icon>bayar
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <v-row class="text-right">
                  <v-col>
                    Total:
                    <span class="text-h6">{{ moneyformatter.format(transaction_info.total) }}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- summary pesanan -->
            <hr />

            <v-select :items="sauceslist" v-model="sauces" small label="Saos" multiple></v-select>
            <!-- tabel pesanan -->
            <v-card outlined>
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">No</th>
                      <th class="text-left">Nama Produk</th>
                      <th class="text-right">Harga</th>
                      <th class="text-right">Qty</th>
                      <th class="text-right">Jumlah</th>
                      <th class="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in transaction_info.stash" :key="item.id">
                      <td>{{ i+1 }}</td>
                      <td>{{ item.name }}</td>
                      <td align="right">{{ moneyformatter.format(item.price) }}</td>
                      <td align="right">{{ item.qty }}</td>
                      <td align="right">{{ moneyformatter.format(item.total) }}</td>
                      <td class="text-center">
                        <v-btn icon color="red" @click="showDeleteDialog(i)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td class="text-h6">Total</td>
                      <td align="right" colspan="4">
                        <p class="text-h6">{{ moneyformatter.format(transaction_info.total) }}</p>
                      </td>
                    </tr>
                  </tfoot>
                </template>
              </v-simple-table>
            </v-card>

            <!-- tabel pesanan -->

            <div></div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <payment
      :open="openpaymentdialog"
      :total="transaction_info.total"
      @close="openpaymentdialog = false"
    ></payment>
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

    <template>
      <v-row justify="center">
        <v-dialog v-model="qty_dialog.visible" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">{{ `Qty '${qty_dialog.menu_name}'?` }}</v-card-title>
            <v-card-text>
              <v-text-field
                ref="qty"
                type="number"
                v-model="qty_dialog.value"
                label="Qty"
                @keyup.enter="onQtyConfirm()"
                outlined
                dense
                clearable
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="qty_dialog.visible = false">batal</v-btn>
              <v-btn color="green darken-1" text @click="onQtyConfirm()">Tambah</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- delete -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dlt_dialog.visible" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">{{ `Hapus '${dlt_dialog.item.name}'?` }}</v-card-title>
            <v-card-text>Apakah anda yakin ingin menghapus pesanan ini?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dlt_dialog.visible = false">batal</v-btn>
              <v-btn color="green darken-1" text @click="deleteStashItem()">Hapus</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!-- delete -->
  </div>
</template>

<script>
import storage from "../../storage";
import money from "../../moneyformat";
import customer_info from "./CustomerInfo";
import printer from "../../printer";
import payment from "./Payment";
export default {
  components: {
    "customer-info": customer_info,
    payment: payment
  },
  data() {
    return {
      currentDate: "",
      openpaymentdialog: false,
      sauceslist: ["Thai", "Black Pepper", "Peanut"],
      menus: [],
      qty_dialog: {
        visible: false,
        menu_name: "",
        value: null
      },
      dlt_dialog: {
        visible: false,
        item: {},
        index: -1
      },
      transaction_info: {
        customer_name: "",
        table_number: null,
        stash: [],
        temp: null,
        total: 0
      },
      sauces: [],
      filter: "",
      notification: {
        visible: false,
        text: "",
        color: "red",
        timeout: 1500
      },
      menu_section: {
        selected_menu: {},
        filter_input: "",
        filter_result: [],
        display_default_count: 1000
      },
      moneyformatter: money()
    };
  },
  mounted() {
    this.countDate();
    this.menus = storage().getMenus();
    this.sauces = storage().getSauces();
    this.menu_section.filter_result = [];
    this.transaction_info.stash = storage().getStash();
    this.countTotal();
    // var formatter = new Intl.NumberFormat("en-US", {
    //   style: "currency",
    //   currency: "USD"
    // });
  },
  watch: {
    filter() {
      this.menu_section.filter_result = this.filterMenu(this.filter);
    },
    sauces() {
      storage().setSauces(this.sauces);
    }
  },
  methods: {
    getCurrentDate() {
      return this.$moment()
        .locale("id")
        .format("dddd, Do MMMM YYYY");
    },
    countDate() {
      // window.setInterval(() => {

      // }, 1000);
      this.currentDate = this.getCurrentDate();
    },
    filterMenu(query) {
      if (query != "") {
        return this.menus.filter(item => {
          return (
            (item.barcode && item.barcode.includes(query)) ||
            item.name.toLowerCase().includes(query)
          );
        });
      }
    },
    inputMenu(menuIndex = null) {
      if (menuIndex != null) {
        this.insertMenuToStash(this.menu_section.filter_result[menuIndex]);
      }
      if (this.menu_section.filter_result.length == 1) {
        // popup quantity
        this.insertMenuToStash(this.menu_section.filter_result[0]);
      } else if (this.menu_section.filter_result.length == 0) {
        this.notification.visible = true;
        this.notification.text = "Barang tidak ditemukan";
        this.notification.color = "red";
      }
    },
    insertMenuToStash(val) {
      this.transaction_info.temp = val;
      setTimeout(() => {
        this.$refs.qty.focus();
      }, 1);

      this.qty_dialog.visible = true;
      this.qty_dialog.menu_name = val.name;
    },
    onQtyConfirm() {
      let updateQtyMode = false;
      if (this.qty_dialog.value == null || this.qty_dialog.value == 0) {
        this.qty_dialog.value = 1;
      }

      // jika menu sudah masuk update qty
      this.transaction_info.stash.map((item, i) => {
        if (item.id == this.transaction_info.temp.id) {
          this.transaction_info.stash[i].qty += parseInt(this.qty_dialog.value);
          this.transaction_info.stash[i].total =
            this.transaction_info.stash[i].qty * item.price;
          updateQtyMode = true;
        }
      });

      if (!updateQtyMode) {
        let val = {
          ...this.transaction_info.temp,
          ...{
            qty: this.qty_dialog.value,
            total: this.qty_dialog.value * this.transaction_info.temp.price
          }
        };
        this.transaction_info.stash.unshift(val);
      }

      this.qty_dialog.visible = false;
      this.qty_dialog.value = null;
      setTimeout(() => {
        this.$refs.filter.focus();
      }, 1);
      this.countTotal();
      storage().setStash(this.transaction_info.stash);
      this.filter = "";
    },
    countTotal() {
      let total = 0;
      this.transaction_info.stash.map(item => {
        total += item.total;
      });
      this.transaction_info.total = total;
    },
    showDeleteDialog(index) {
      this.dlt_dialog.item = this.transaction_info.stash[index];
      this.dlt_dialog.visible = true;
      this.dlt_dialog.index = index;
    },
    deleteStashItem() {
      this.transaction_info.stash.splice(this.dlt_dialog.index, 1);
      this.dlt_dialog.visible = false;
      this.countTotal();
      storage().setStash(this.transaction_info.stash);
    },
    clearStash() {
      storage().setStash([]);
      this.transaction_info.stash = [];
      this.transaction_info.total = 0;
      this.sauces = [];
      this.$refs.cinfo.clear();
    },
    isValidReservation() {
      let name = this.$refs.cinfo.getName();
      // let table = this.$refs.cinfo.getTable();
      if (name == null || name == "") {
        this.notification.visible = true;
        this.notification.text =
          "Pastikan nama pembeli dan no meja sudah diisi";
        return false;
      }

      return true;
    },
    checkout() {
      if (this.isValidReservation()) {
        let reserve = {
          id: Date.now(),
          customer_name: this.$refs.cinfo.getName(),
          table_number: this.$refs.cinfo.getTable(),
          date: this.$moment().format("YYYY-MM-DD"),
          time: this.$moment().format("H:mm:ss"),
          total: this.transaction_info.total,
          stash: this.transaction_info.stash,
          paid: 0,
          sauces: this.sauces
        };
        storage().pushTransaction(reserve);
        this.clearStash();
      }
    },
    pay() {
      if (this.isValidReservation()) {
        this.openpaymentdialog = true;
      }
    },
    print() {
      if (this.isValidReservation()) {
        printer().init();
        printer().print();
      }
    }
  }
};
</script>