<template>
  <div>
    <v-row>
      <v-col rows="12" md="8" sm="12">
        <v-text-field
          v-model="name"
          ref="customer_name"
          label="Nama Pembeli"
          outlined
          dense
          clearable
        ></v-text-field>
      </v-col>
      <v-col rows="12" md="4" sm="12">
        <v-text-field v-model="table" type="number" label="No Meja" outlined dense clearable></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import storage from "../../storage";
export default {
  data() {
    return {
      name: null,
      table: null
    };
  },
  watch: {
    name: {
      handler: "updateCurrentTransaction"
    },
    table: {
      handler: "updateCurrentTransaction"
    }
  },
  mounted() {
    this.$refs.customer_name.focus();
    let customer = storage().getCurrentTransaction();
    this.name = customer.customer_name ? customer.customer_name : null;
    this.table = customer.table_number ? customer.table_number : null;
  },
  methods: {
    updateCurrentTransaction() {
      storage().setCurrentTransaction({
        customer_name: this.name,
        table_number: this.table
      });
      this.$emit("update_name", this.cname);
      this.$emit("update_table", this.ctable);
    },
    clear() {
      this.name = null;
      this.table = null;
      this.$nextTick(() => {
        this.$refs.customer_name.focus();
      });
    },
    getName() {
      return this.name;
    },
    getTable() {
      return this.table;
    }
  }
};
</script>