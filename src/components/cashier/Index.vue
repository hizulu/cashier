<template>
  <div>
    <div class="text-h3 mb-4">Kasir</div>
    <v-card outlined>
      <v-container>
        <div class="mb-5">{{ currentDate }}</div>

        <v-row>
          <v-col cols="12" sm="4">
            <div class="text-h6">Pencarian Menu</div>
            <hr />
            <br />
            <v-text-field label="Barcode atau nama menu" outlined dense clearable></v-text-field>
            <v-card outlined>
              <v-subheader>Hasil pencarian menu</v-subheader>
              <v-list dense>
                <v-list-item-group v-model="selectedMenu" color="primary">
                  <v-list-item v-for="(menu, i) in menus" :key="i">
                    <v-list-item-content>
                      <v-list-item-title v-html="menu.name"></v-list-item-title>
                      <v-list-item-subtitle v-html="menu.price"></v-list-item-subtitle>
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
                <v-text-field label="Nama Pembeli" outlined dense clearable></v-text-field>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentDate: "",
      selectedMenu: {},
      menus: [
        {
          code: 0,
          name: "menu akan tampil disini",
          price: ""
        }
      ],
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
      ]
    };
  },
  mounted() {
    this.countDate();
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
    }
  }
};
</script>