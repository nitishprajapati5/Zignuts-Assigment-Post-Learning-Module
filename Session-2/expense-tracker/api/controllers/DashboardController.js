module.exports = {
  "get-all-accounts": async (req, res) => {

    console.log(req.session.user.id);  

    const accounts = await sails.models.account.find({where:{user:req.session.user.id}});  
    const user = req.session.user;  
    if(!user){
      return res.redirect('/');
    }   
    res.view("pages/dashboard/index", { layout: "layouts/layout", accounts,user });
  },
};
