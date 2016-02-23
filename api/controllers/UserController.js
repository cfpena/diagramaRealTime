module.exports = {

  list: function(req, res){
    User.find().populateAll().exec(function(err, users) {
        res.view({users: users});
    });
  }
};
