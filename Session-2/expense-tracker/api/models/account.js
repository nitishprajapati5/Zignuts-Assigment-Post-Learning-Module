module.exports = {

  attributes: {

    accountName: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 50
    },

    isDeleted: {
      type: 'boolean',
      defaultsTo: false
    },

    accountType: {
      type: 'string',
      required: true,
      isIn: ['cash', 'bank', 'credit_card', 'debit_card', 'wallet', 'other','savings','checking']
    },
    isDefault: {
      type: 'boolean',
      defaultsTo: false
    },
    status: {
      type: 'string',
      required: true,
      isIn: ['active', 'inactive']
    },
    balance: {
      type: 'number',
      required: true,
      //defaultsTo: 0
    },
    // 🔗 belongs to one user
    user: {
      model: 'user',
      required: true
    }

  }

};
