module.exports = {
  "get-all-accounts": async (req, res) => {

    
     const user = req.session.user;  
      if(!user){
        return res.redirect('/');
      }   

    const accounts = await sails.models.account.find({where:{user:req.session.user.id,isDeleted:false}}); 
    const inactiveAccounts = await sails.models.account.find({where:{user:req.session.user.id,isDeleted:true}}); 
    //req.flash('success','Welcome to dashboard');

    res.view("pages/dashboard/index", { layout: "layouts/layout", accounts,user,inactiveAccounts });
  },
  'create-account':async (req,res) => {
    try {
      const user = req.session.user;  
      if(!user){
        return res.redirect('/');
      }   
      res.view("pages/dashboard/create", { layout: "layouts/layout", user });
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },
  'create-account-post':async (req,res) => {
    try {
      const user = req.session.user;  
      if(!user){
        return res.redirect('/');
      }   
      const {accountName,accountType,balance} = req.allParams();
      const account = await sails.models.account.create({accountName,accountType,balance,user:user.id,status:'active'});
      //req.flash('success','Account Created Successfully');
      return res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
      return res.serverError(error);  
    }
  },
  'edit-account':async (req,res) => {
    try {
      const user = req.session.user;  
      if(!user){
        return res.redirect('/');
      }   
      const {id} = req.params;


      const account = await sails.models.account.findOne({where:{id}});
      res.view("pages/dashboard/edit", { layout: "layouts/layout", account,user });
    } catch (error) {
      console.log(error);
      return res.serverError(error);  
    }
  },
  'edit-account-post':async (req,res) => {
    try {
      const user = req.session.user;  
      if(!user){
        return res.redirect('/');
      }   
      const {id} = req.params;
      const {accountName,accountType,balance,isDefaultAccount} = req.allParams();
      const account = await sails.models.account.update({id},{accountName,accountType,balance,isDefault:isDefaultAccount});
      //req.flash('success','Account Updated Successfully');
      return res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
      return res.serverError(error);  
    }
  },
  'delete-account':async (req,res) => {
    try {
      const user = req.session.user;  
      if(!user){
        return res.redirect('/');
      }   
      const {id} = req.params;
      const account = await sails.models.account.update({id},{isDeleted:true,status:'inactive'});
      //req.flash('success','Account Deleted Successfully');
      return res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
      return res.serverError(error);  
    }
  },
  'activate-account':async (req,res) => {
    try {
      const user = req.session.user;  
      if(!user){
        return res.redirect('/');
      }   
      const {id} = req.params;
      const account = await sails.models.account.update({id},{isDeleted:false,status:'active'});
      return res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
      return res.serverError(error);  
    }
  }, 
  'set-default-account':async (req,res) => {
    try {
      const user = req.session.user;  
      if(!user){
        return res.redirect('/');
      }   
      const {id} = req.params;

      const existingDefaultAccount = await sails.models.account.findOne({where:{user:user.id,isDefault:true}});
      if(existingDefaultAccount){
        await sails.models.account.update({id:existingDefaultAccount.id},{isDefault:false});
      }

      const account = await sails.models.account.update({id},{isDefault:true});
      return res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
      return res.serverError(error);  
    }
  }, 
};
