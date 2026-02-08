
module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 50,
    },

    email: {
      type: 'string',
      required: true,
      isEmail: true,
      unique: true,
    },

    password: {
      type:'string',
      required: true,
      minLength: 6,
      protect: true,
    },

    accounts: {
      collection: 'account',
      via: 'user'
    }
  },
};
