<template>
  <div>
    <v-card outlined>
      <v-row>
        <v-col cols="12">
          <v-row align="center" justify="center">
            <v-col>
              <div class="text-h4 text-center">Cafe Momon Candidasa</div>
              <div class="text-center">Aplikasi Kasir</div>

              <div class="mt-4 text-center">
                <p>
                  Terakhir download menu :
                  <span>{{ (lastDownloadMenu == null) ? '-' : lastDownloadMenu }}</span>
                </p>
                <p>
                  Close Order :
                  <span>{{ (isCloseOrder) ? 'Ya' : 'Tidak' }}</span>
                </p>

                <v-alert
                  prominent
                  text
                  type="info"
                  v-if="lastDownloadMenu != null && menus.length > 0"
                >
                  Pertama kali membuka aplikasi Tekan
                  <strong>DOWNLOAD MENU</strong>.
                  <br />Jika Cafe akan tutup tekan
                  <strong>CLOSE ORDER</strong>
                </v-alert>
                <v-alert prominent text type="error" v-else>
                  Silakan tekan
                  <strong>DOWNLOAD MENU</strong> untuk mengunduh daftar menu
                </v-alert>

                <v-overlay :value="loader.downloadMenu">
                  <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>

                <v-row justify="center">
                  <div class="mx-2 my-2">
                    <v-btn color="primary" @click="downloadMenu()">Download menu</v-btn>
                  </div>
                  <div class="mx-2 my-2" v-if="lastDownloadMenu != null">
                    <v-btn
                      :loading="loader_close_order"
                      @click="closeOrder()"
                    >{{ (isCloseOrder)?'OPEN ORDER' : 'CLOSE ORDER' }}</v-btn>
                  </div>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import firebase from "../firebase";
import storage from "../storage";

export default {
  data: () => {
    return {
      db: null,
      loader_close_order: false,
      closeOrderDialog: {
        visible: false
      },
      lastCloseOrder: storage().getCloseOrder(),
      lastDownloadMenu: null,
      loader: {
        downloadMenu: false
      },
      menus: []
    };
  },
  created() {
    this.lastDownloadMenu = storage().getLastDownloadMenu();
    this.menus = storage().getMenus();
  },
  computed: {
    isCloseOrder() {
      return storage().getCloseOrder();
    }
  },
  mounted() {},
  methods: {
    downloadMenu() {
      this.loader.downloadMenu = true;
      setTimeout(() => {
        let menus = [];
        firebase()
          .db.collection("menus")
          .get()
          .then(snapshot => {
            if (!snapshot.empty) {
              snapshot.forEach(doc => {
                menus.push({ ...{ id: doc.id }, ...doc.data() });
              });
            }
            storage().setMenus(JSON.stringify(menus));
            this.menus = menus;
            this.lastDownloadMenu = this.$moment()
              .locale("id")
              .format("dddd, Do MMMM YYYY H:mm:ss ");
            storage().setLastDownloadMenu(this.lastDownloadMenu);
          })
          .catch(err => {
            console.log(err);
          });
        this.loader.downloadMenu = false;
      }, 1000);
    },
    closeOrder() {
      this.loader_close_order = true;
      storage().setCloseOrder(!storage().getCloseOrder());
      this.$router.go();
    }
  }
};
</script>