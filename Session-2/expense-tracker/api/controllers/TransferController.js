module.exports = {
  create: async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.redirect("/");
      }
      const currentUser = await User.findOne({ id: user.id }).populate(
        "friends",
      );
      const currentAccounts = await account.find({
        where: { user: user.id, isDeleted: false },
      });
      const friends = currentUser.friends;
      res.view("pages/transfer/index", {
        layout: "layouts/layout",
        user,
        currentAccounts,
        friends,
      });
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },
  "create-post": async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) return res.redirect("/");

      let { from, to, amount, type } = req.allParams();
      amount = parseFloat(amount);

      const reloadData = async () => {
        const currentUser = await User.findOne({ id: user.id }).populate(
          "friends",
        );
        const currentAccounts = await account.find({
          where: { user: user.id, isDeleted: false },
        });
        return { user, currentAccounts, friends: currentUser.friends };
      };

      const srcAccount = await account.findOne({ id: from, user: user.id });
      if (!srcAccount || srcAccount.balance < amount) {
        const data = await reloadData();
        return res.view("pages/transfer/index", {
          ...data,
          layout: "layouts/layout",
          status: "error",
          message: "Insufficient balance or invalid account",
        });
      }

      const recipientAccounts = await account.find({
        where: { user: to, isDeleted: false },
      });

      if (recipientAccounts.length === 0) {
        const data = await reloadData();
        return res.view("pages/transfer/index", {
          ...data,
          layout: "layouts/layout",
          status: "error",
          message: "Recipient has no active account",
        });
      }

      const targetAccount =
        recipientAccounts.find((acc) => acc.isDefault) || recipientAccounts[0];

      await account.updateOne({ id: srcAccount.id }).set({
        balance: srcAccount.balance - amount,
      });

      await account.updateOne({ id: targetAccount.id }).set({
        balance: targetAccount.balance + amount,
      });

      await transaction.create({
        from: srcAccount.id,
        fromUser: user.id, // The sender
        to: targetAccount.id,
        toUser: to, // The recipient
        amount: amount,
        type: type,
        user: user.id, // The person seeing this in their history
      });

      await transaction.create({
        from: targetAccount.id,
        fromUser: to,
        to: srcAccount.id,
        toUser: user.id,
        amount: amount,
        type: "Income",
        user: to,
      });

      const finalData = await reloadData();
      return res.view("pages/transfer/index", {
        ...finalData,
        layout: "layouts/layout",
        status: "success",
        message: `Successfully transferred Rs.${amount}!`,
      });
    } catch (error) {
      console.error("Transfer Error:", error);
      return res.serverError(error);
    }
  },
  "history": async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) return res.redirect("/");

      // Since our model has a 'user' attribute representing the owner of the record,
      // we just fetch all transactions belonging to this user.
      const allTransactions = await transaction
        .find({ user: user.id, isDeleted: false })
        .populate("from")
        .populate("to")
        .populate("fromUser")
        .populate("toUser")
        .sort("createdAt DESC");

      return res.view("pages/transfer/history", {
        layout: "layouts/layout",
        user,
        transactions: allTransactions,
      });
    } catch (error) {
      console.error("History Fetch Error:", error);
      return res.serverError(error);
    }
  },
  'delete-transaction': async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) return res.redirect("/");
      const { id } = req.allParams();
      const Id = await transaction.findOne({ id });
      if (!Id) {
        return res.view("pages/transfer/history", {
          layout: "layouts/layout",
          user,
          transactions: [],
        },{message:"Transaction not found",status:"error"});
      }
      await transaction.updateOne({ id }).set({ isDeleted: true });
      const allTransactions = await transaction
        .find({ user: user.id, isDeleted: false })
        .populate("from")
        .populate("to")
        .populate("fromUser")
        .populate("toUser")
        .sort("createdAt DESC");
      return res.view("pages/transfer/history", {
        layout: "layouts/layout",
        user,
        transactions: allTransactions,
      },{message:"Transaction deleted successfully",status:"success"});
    } catch (error) {
      console.error("Delete Transaction Error:", error);
      return res.serverError(error);
    }
  }
};
