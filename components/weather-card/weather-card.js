Component({
  properties: {
    weather: {
      type: Object,
      value: null
    },
    loading: {
      type: Boolean,
      value: false
    },
    error: {
      type: String,
      value: ''
    }
  },

  data: {

  },

  methods: {
    onRetry: function() {
      this.triggerEvent('retry')
    }
  }
})
