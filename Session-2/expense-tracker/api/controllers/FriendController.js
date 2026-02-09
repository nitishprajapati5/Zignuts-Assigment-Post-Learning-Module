module.exports = {
  "get-all-friends": async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.redirect("/");
      }
      const search = req.query.search || "";

      const currentUser = await User.findOne({ id: user.id }).populate(
        "friends",
      );
      const friends = currentUser.friends.map((friend) => friend.id);

      const excludeIds = [...friends, user.id];
      let allUsers;
      if (search === "all") {
        allUsers = await User.find({ where: { id: { "!=": excludeIds } } });
      } else {
        allUsers = await User.find({
          where: {
            id: { "!=": excludeIds },
            or: [
              { name: { contains: search } },
              { email: { contains: search } },
            ],
            id:{'!=':user.id}
          },
        });
      }

      const myFriendIds = currentUser.friends.map((friend) => friend.id);

      console.log(myFriendIds);


      res.view("pages/friends/index", {
        layout: "layouts/layout",
        friends: allUsers,
        user,
        myFriendIds
      });
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },
  "add-friends": async (req, res) => {
    try {
      const user = req.session.user;
       if (!user) {
        return res.redirect("/");
      }
      const {id} = req.params;
      const friend = await User.findOne({ id });
      if(user.id === id){
        return res.badRequest("You cannot add yourself as a friend");
      }

      await User.addToCollection(user.id, "friends", friend.id);
      await User.addToCollection(friend.id, "friends", user.id);

      //const friends = await sails.models.user.find({ where: { id: user.id } });
     return res.redirect("/friends?search=all")
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },
  "get-my-friends": async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.redirect("/");
      }
      const currentUser = await User.findOne({ id: user.id }).populate(
        "friends",
      );
      const friends = currentUser.friends;

      console.log(friends);

      res.view("pages/friends/my-friends", {
        layout: "layouts/layout",
        friends,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },
  "remove-friends": async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.redirect("/");
      }
      const {id} = req.params;
      const friend = await User.findOne({ id });
      await User.removeFromCollection(user.id, "friends", friend.id);
      await User.removeFromCollection(friend.id, "friends", user.id);
      return res.redirect("/friends/my-friends");
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  }
};
