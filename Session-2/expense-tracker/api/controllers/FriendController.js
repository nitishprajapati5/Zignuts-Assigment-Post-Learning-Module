module.exports = {
    'get-all-friends':async (req,res) => {
        try {
            const user = req.session.user;  
            if(!user){
                return res.redirect('/');
            }  
             
            const currentUser = await User.findOne({id:user.id}).populate('friends');
            const friends = currentUser.friends.map(friend => friend.id);
            
            const excludeIds = [...friends,user.id];
            const allUsers = await User.find({where:{id:{'!=':excludeIds}}});
            console.log(allUsers);

            res.view("pages/friends/index", { layout: "layouts/layout", friends:allUsers,user });
        } catch (error) {
            console.log(error);
            return res.serverError(error);  
        }
    },
    'add-friends':async (req,res) => {
        try {
            const user = req.session.user;  
            if(!user){
                return res.redirect('/');
            }   
            const friends = await sails.models.user.find({where:{id:user.id}});
            res.view("pages/dashboard/add-friends", { layout: "layouts/layout", friends,user });
        } catch (error) {
            console.log(error);
            return res.serverError(error);  
        }
    }
}