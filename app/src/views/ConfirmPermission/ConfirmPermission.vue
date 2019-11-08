<template>
  <v-card class="confirm-permission" flat outlined>
    <v-layout class="title-container">
      <v-flex x12 class="primary text-center pt-10 pb-8">
        <img :src="require('../../../public/img/icons/permission-lock.svg')" width="50" />
        <h1 class="headline">Permission Needed</h1>
      </v-flex>
    </v-layout>
    <v-layout wrap class="body-2 pa-6">
      <v-flex x12 class="mb-6">
        <span class="subtitle-2 mr-1">Request from:</span>
        <network-display></network-display>
      </v-flex>
      <v-flex x12 class="text_1--text permission-list">
        <div class="subtitle-2 mb-4">To allow the following:</div>
        <div class="body-2 mb-3">
          <v-icon small class="error--text" v-text="'$vuetify.icons.info'" />
          <span class="d-inline ml-2">Access to your Google, email and profile photo</span>
        </div>
        <div class="body-2 mb-3">
          <v-icon small class="error--text" v-text="'$vuetify.icons.info'" />
          <span class="d-inline ml-2">Permission to change network to process transaction</span>
        </div>
        <div class="body-2 mb-3">
          <v-icon small class="error--text" v-text="'$vuetify.icons.info'" />
          <span class="d-inline ml-2">
            Transact with providers
            <span class="text_2--text font-italic">("Kyberswap.com, Cryptokitties.com, compound.finance")</span>
            within the next 6hrs.
          </span>
        </div>
      </v-flex>
      <v-flex x12 class="caption text_2--text mt-10">
        Note: You can edit permissions under your wallet 'Settings'.
      </v-flex>
    </v-layout>
    <v-layout class="pa-6">
      <v-flex xs6>
        <v-btn block text large class="text_2--text" @click="triggerDeny">Cancel</v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">Confirm</v-btn>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import NetworkDisplay from '../../components/helpers/NetworkDisplay'

export default {
  components: {
    NetworkDisplay
  }
}
</script>

<style lang="scss" scoped>
@import 'ConfirmPermission.scss';
</style>
