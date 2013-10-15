exports.index = function(req, res){
    res.render('index', { title: 'Adventus', routePath: "about" });
};