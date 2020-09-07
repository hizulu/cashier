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
    <div class="text-h3 mb-4">Kasir</div>
    <v-card outlined>
      <v-container>
        <div class="mb-5">{{ currentDate }}</div>

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
                <v-list-item-group v-model="selectedMenu" color="primary">
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
            <v-row>
              <v-col rows="12" md="8" sm="12">
                <v-text-field ref="customer_name" label="Nama Pembeli" outlined dense clearable></v-text-field>
              </v-col>
              <v-col rows="12" md="4" sm="12">
                <v-text-field label="No Meja" outlined dense clearable></v-text-field>
              </v-col>
            </v-row>
            <!-- informasi pembeli -->

            <!-- summary pesanan -->
            <v-row>
              <v-col cols="12" md="6">
                <div>
                  <v-btn class="ma-2" depressed small tile outlined color="primary" dark>
                    <v-icon left>mdi-printer</v-icon>cetak nota
                  </v-btn>
                  <v-btn class="ma-2" depressed small tile color="primary" dark>
                    <v-icon left>mdi-send</v-icon>checkout
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-row class="text-right">
                  <v-col>
                    Total:
                    <span class="text-h6">Rp. 2,000</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- summary pesanan -->
            <hr />

            <v-select :items="sauces" small label="Saos" multiple></v-select>
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
                    <tr v-for="(item, i) in desserts" :key="item.name">
                      <td>{{ i+1 }}</td>
                      <td>{{ item.name }}</td>
                      <td align="right">{{ item.price }}</td>
                      <td align="right">{{ item.qty }}</td>
                      <td align="right">{{ item.total }}</td>
                      <td class="text-center">
                        <v-btn icon color="red">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td class="text-h6">Total</td>
                      <td align="right" colspan="4">
                        <p class="text-h6">1234</p>
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
                @focus="qty_dialog.visible"
                label="Qty"
                outlined
                dense
                clearable
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="qty_dialog.visible = false">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script>
import { nextTick } from "vue/types/umd";
import storage from "../../storage";
import money from "../../moneyformat";
export default {
  data() {
    return {
      currentDate: "",
      selectedMenu: {},
      sauces: ["Thai", "Black Pepper", "Peanut"],
      menus: [],
      qty_dialog: {
        visible: false,
        menu_name: ""
      },
      desserts: [
        {
          name: "Frozen Yogurt",
          price: 1000,
          qty: 2,
          total: 2000
        },
        {
          name: "Yogurt",
          price: 1000,
          qty: 2,
          total: 2000
        }
      ],
      transaction_info: {
        customer_name: "",
        table_number: "",
        stash: []
      },
      filter: "",
      notification: {
        visible: false,
        text: "",
        color: "red",
        timeout: 1000
      },
      menu_section: {
        selected_menu: {},
        filter_input: "",
        filter_result: [],
        display_default_count: 100
      },
      moneyformatter: money()
    };
  },
  mounted() {
    this.countDate();
    this.menus = storage().getMenus();
    this.menu_section.filter_result = this.menus.slice(
      0,
      this.menu_section.display_default_count
    );

    this.$refs.customer_name.focus();
    // var formatter = new Intl.NumberFormat("en-US", {
    //   style: "currency",
    //   currency: "USD"
    // });
  },
  watch: {
    filter() {
      this.menu_section.filter_result = this.filterMenu(this.filter);
    }
  },
  methods: {
    getCurrentDate() {
      return this.$moment()
        .locale("id")
        .format("dddd, Do MMMM YYYY, H:mm:ss ");
    },
    countDate() {
      window.setInterval(() => {
        this.currentDate = this.getCurrentDate();
      }, 1000);
    },
    filterMenu(query) {
      return this.menus.filter(item => {
        return (
          item.barcode.includes(query) ||
          item.name.toLowerCase().includes(query)
        );
      });
    },
    inputMenu(menuIndex = null) {
      if (menuIndex != null) {
        this.insertMenuToStash(this.menu_section.filter_result[menuIndex]);
      }
      if (this.menu_section.filter_result.length == 1) {
        console.log("asda mantap");
        // popup quantity
        this.insertMenuToStash(this.menu_section.filter_result[0]);
      } else if (this.menu_section.filter_result.length == 0) {
        this.notification.visible = true;
        this.notification.text = "Barang tidak ditemukan";
        this.notification.color = "red";
      }
    },
    insertMenuToStash(menu) {
      // this.$refs.qty.$el.focus();
      this.qty_dialog.visible = true;
      this.qty_dialog.menu_name = menu.name;
      this.filter = "";
    }
  }
};
</script>