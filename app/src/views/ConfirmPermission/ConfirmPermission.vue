<template>
  <v-container pa-0>
    <page-loader class="pt-4" v-if="type === 'none'" />
    <v-card v-else class="confirm-permission" flat outlined>
      <v-layout class="title-container">
        <v-flex x12 class="primary text-center pt-10 pb-8">
          <img :src="require('../../../public/img/icons/permission-lock.svg')" width="50" />
          <h1 class="headline">Permission Needed</h1>
        </v-flex>
      </v-layout>
      <v-layout wrap class="body-2 pa-6">
        <v-flex x12 class="mb-4">
          <span class="subtitle-2 mr-1">Network:</span>
          <network-display></network-display>
        </v-flex>
        <v-flex x12 class="mb-6">
          <span class="subtitle-2 mr-1">Request from:</span>
          <v-chip small class="caption black--text" color="#CDE0FF">{{ origin }}</v-chip>
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
              <span class="text_2--text font-italic">("{{ providersDisplay }}")</span>
              within the next 6hrs.
            </span>
          </div>
        </v-flex>
        <v-flex x12 class="caption text_2--text mt-6">Note: You can edit permissions under your wallet 'Settings'.</v-flex>
      </v-layout>
      <v-layout class="px-6 pb-6 pt-0">
        <v-flex xs6>
          <v-btn block text large class="text_2--text" @click="triggerDeny">Cancel</v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">Confirm</v-btn>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import BroadcastChannel from 'broadcast-channel'
import PageLoader from '../../components/helpers/PageLoader'
import NetworkDisplay from '../../components/helpers/NetworkDisplay'
import { broadcastChannelOptions } from '../../utils/utils'
import log from 'loglevel'

const POPUP_TYPE_PROVIDER_CHANGE = 1
const POPUP_TYPE_REQUEST_INFO = 2

export default {
  name: 'confirm',
  components: {
    PageLoader,
    NetworkDisplay
  },
  data() {
    return {
      origin: '',
      type: 'none',
      postMessageType: '',
      broadcastChannelMessage: '',
      message: '',
      network: '',
      rpcNetwork: {},
      payload: {},
      providers: ['kyberswap.com', 'cryptokitties.com', 'compound.finance'],
      popupType: '',
      POPUP_TYPE_PROVIDER_CHANGE,
      POPUP_TYPE_REQUEST_INFO
    }
  },
  methods: {
    async triggerSign(event) {
      var bc = new BroadcastChannel(
        `${this.broadcastChannelMessage}${new URLSearchParams(window.location.search).get('instanceId')}`,
        broadcastChannelOptions
      )
      await bc.postMessage({
        data: { type: `confirm-${this.postMessageType}`, payload: this.payload, approve: true }
      })
      bc.close()
      window.close()
    },
    async triggerDeny(event) {
      var bc = new BroadcastChannel(
        `${this.broadcastChannelMessage}${new URLSearchParams(window.location.search).get('instanceId')}`,
        broadcastChannelOptions
      )
      await bc.postMessage({ data: { type: `deny--${this.postMessageType}`, approve: false } })
      bc.close()
      window.close()
    }
  },
  computed: {
    providersDisplay() {
      return this.providers.join(', ')
    }
  },
  mounted() {
    const popupUrl = new URL(window.location)
    if (popupUrl.pathname === '/userinforequest') {
      this.popupType = POPUP_TYPE_REQUEST_INFO
      this.broadcastChannelMessage = 'user_info_request_channel_'
      this.postMessageType = 'provider-change'
    } else if (popupUrl.pathname === '/providerchange') {
      this.popupType = POPUP_TYPE_PROVIDER_CHANGE
      this.broadcastChannelMessage = 'torus_provider_change_channel_'
      this.postMessageType = 'user-info-request'
    }

    var bc = new BroadcastChannel(
      `${this.broadcastChannelMessage}${new URLSearchParams(window.location.search).get('instanceId')}`,
      broadcastChannelOptions
    )
    bc.onmessage = async ev => {
      const {
        payload: { network, type },
        origin
      } = ev.data || {}
      this.payload = { network, type }
      let url = { hostname: '' }
      try {
        url = new URL(origin)
      } catch (err) {
        log.error(err)
      }
      this.origin = url.hostname // origin of tx: website url

      if (this.popupType === POPUP_TYPE_PROVIDER_CHANGE) {
        if (type && type === 'rpc') {
          this.rpcNetwork = network
          this.type = type
        } else {
          this.network = network
          this.type = 'non-rpc'
        }
      } else if (this.popupType === POPUP_TYPE_REQUEST_INFO) {
        this.type = 'userInfo'
        this.message = payload && payload.message ? payload.message : ''
      }

      bc.close()
    }
    bc.postMessage({ data: 'popup-loaded' })
  }
}
</script>

<style lang="scss" scoped>
@import 'ConfirmPermission.scss';
</style>
