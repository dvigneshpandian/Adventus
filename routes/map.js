exports.index = function(req, res){
    res.render('search', {products:JSON.stringify(docs), routePath: "map"});
};