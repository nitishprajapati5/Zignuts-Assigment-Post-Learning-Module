module.exports = {
  index: async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.redirect("/");
      }
      const currentUser = await User.findOne({ id: user.id }).populate(
        "friends",
      );
      const currentAccounts = await account.find({where:{user:user.id,isDeleted:false}});
      const friends = currentUser.friends;
      res.view("pages/transfer/index", { layout: "layouts/layout", user,currentAccounts,friends });
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },
};
