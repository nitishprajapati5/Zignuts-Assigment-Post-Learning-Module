
module.exports = {
  'render-login': async function (req, res) {
    //console.log(typeof User)
    return res.view('pages/auth/login', { layout: 'layouts/Authlayout' });
  },


  'login': async function (req, res) {
    const { email, password } = req.allParams();
    const user = await sails.models.user.findOne({where:{email:email}});
    if (!user || user.password !== password) {
      return res.badRequest('Invalid Email or Password');
    }

    const doesKeyExist = await CacheService.get(`user:${user.id}`);
    if (doesKeyExist) {
      return res.redirect('/dashboard');
    }

    //Redis Input
    await CacheService.set(`user:${user.id}`,user,60*60*24);

    req.session.user = user;
    return res.redirect('/dashboard');
  },


  'render-register': async function (req, res) {
    return res.view('pages/auth/register', { layout: 'layouts/Authlayout' });
  },


  'register': async function (req, res) {   
    try {
      const { name, email, password } = req.allParams();

      sails.log.info(name, email, password);

      const doesUserExist = await sails.models.user.findOne({where:{email:email}});
      if (doesUserExist) {
        return res.badRequest('User already exists');
      }

    const user = await sails.models.user.create({
      name,
      email,
      password, 
    }).fetch();

    await sails.models.account.create({
      accountName:'default',
      user:user.id,
      accountType:'cash',
      balance:0,
      status:'active',
      isDefault:true
    });

    console.log(user.id);

    req.session.user = user;
    return res.redirect('/dashboard');
    } catch (error) {
      sails.log.error(error);
      return res.serverError('Something went wrong');
    }
  },

  "logout": function(req, res) {
    req.session.destroy(function(err) {
      if (err) return res.serverError(err);
      return res.redirect('/');
    });
  }
};
