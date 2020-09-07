<template>
  <v-app>
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      :permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      app
      overflow
    >
      <v-list dense>
        <template v-for="item in items">
          <v-list-item link :to="item.route" :key="item.text">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <v-row style="padding:24px">
        <v-col cols="12" md="12">
          <span>Tema Gelap</span>
          <v-switch v-model="dark_mode" primary label="Dark"></v-switch>
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="primaryDrawer.clipped" elevate-on-scroll app>
      <v-app-bar-nav-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="primaryDrawer.model = !primaryDrawer.model"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Cafe Momon Candidasa</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="10">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer :inset="footer.inset" app>
      <span class="px-4">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import storage from "./storage";
export default {
  data: () => ({
    drawers: ["Default (no property)", "Permanent", "Temporary"],
    items: [
      { text: "Beranda", icon: "mdi-home", route: "/" },
      { text: "Kasir", icon: "mdi-folder", route: "/kasir" },
      {
        text: "Riwayat Transaksi",
        icon: "mdi-account-multiple",
        route: "/transaksi"
      }
    ],
    dark_mode: false,
    primaryDrawer: {
      model: null,
      type: "temporary",
      clipped: false,
      floating: false,
      mini: false
    },
    footer: {
      inset: false
    }
  }),
  mounted() {
    this.getDarkMode();
  },
  watch: {
    dark_mode() {
      console.log(`change dark:  ${this.dark_mode}`);
      this.setDarkMode(this.dark_mode);
    }
  },
  methods: {
    setDarkMode(value) {
      storage().setDarkModeStatus(value);
      this.$vuetify.theme.dark = value;
    },
    getDarkMode() {
      this.dark_mode = storage().getDarkModeStatus();
    }
  }
};
</script>