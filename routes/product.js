//CopyRight Tag Solutions pvt.ltd 2013
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , path = require('path');

var propertySchema = new Schema({
    productType: String,
    productName: String,
    productPrice: Number,
    productIsAvaliable: Boolean,
    type: Array,
    price: Number,
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    amenities: Array,
    comments_from_user: Array,
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    LatLng: {
        latitude: Number,
        longitude: Number
    },
    picture:{
        linkFront:String,
        linkBack:String,
        linkLeft:String,
        linkRight:String
    }
});

var propertyModel = mongoose.model('Property', propertySchema);

exports.index = function (req, res) {
    propertyModel.find({}, function (err, docs) {
        if (err) return res.render('Error occurred');
        res.render('index', {products: docs, routePath: "prod", title: 'Product List - By Sandeep Pagi'});
    });
};



exports.new = function (req, res) {
    res.render("index", {routePath: "Add", title: 'Add New Product - By Sandeep Pagi'});
};

exports.create = function (req, res) {
    var temp = req.body;
    new propertyModel({
        productType: temp.productType,
        productName: temp.productName,
        productPrice: temp.productPrice,
        productIsAvaliable: temp.productIsAvaliable,
        type: temp.type,
        price: temp.price,
        bedrooms: temp.bedrooms,
        bathrooms: temp.bathrooms,
        area: temp.area,
        amenities: temp.amenities,
        comments_from_user: temp.comments_from_user,
        address: {
            line1: temp.line1,
            line2: temp.line2,
            city: temp.city,
            state: temp.state,
            country: temp.country,
            zip: temp.zip
        },
        LatLng: {
            latitude: temp.latitude,
            longitude: temp.longitude
        }
    }).save(function (err, product) {
            if (err) res.json(err)
            res.redirect('/properties/' + temp.productName)
        });
};

exports.pass = function (req, res, next, name) {
    propertyModel.find({productName: name}, function (err, docs) {
        req.product = docs[0];
        next();
    });
};

exports.show = function (req, res) {
    var  pic=path.join('/images',path.basename(req.product.picture));
    res.render('index', { product: req.product,  routePath: "Show", title: 'Edit Product - By Sandeep Pagi' });
};

exports.edit = function (req, res) {
    res.render('index', { product: req.product, routePath: "Edit", title: 'Update Product - By Sandeep Pagi'});
};

exports.update = function (req, res) {
    var b = req.body;
    //Resolving the base path for multiple image file uploaded by user
    var linkFront = req.files.pictureFront.path;
    var linkBack = req.files.pictureBack.path;
    var linkLeft = req.files.pictureLeft.path;
    var linkRight = req.files.pictureRight.path;

    //Create an array of all the file paths uploaded.
    var linkArray= new Array([linkFront],[linkBack],[linkLeft],[linkRight]);

    //Function to iterate the the link array and resolve proper paths and push to resolvedPathArray.
    function resolveBasePath(){
        var resolvedPathArray =new Object();
        for(var i= 0;i <linkArray.length;i++){
            var baseName = path.basename(linkArray[i]);
            var joinedPath = '/images/' + baseName;
            if(i==0){resolvedPathArray.linkFront=joinedPath.toString();}
            if(i==1){resolvedPathArray.linkBack=joinedPath.toString();}
            if(i==2){resolvedPathArray.linkLeft=joinedPath.toString();}
            if(i==3){resolvedPathArray.linkRight=joinedPath.toString();}
        }
        return resolvedPathArray;
    }
    propertyModel.update(
        { productName: req.params.name},
        { productName: b.name,
            type: b.type,
            price: b.price,
            bedrooms: b.bedrooms,
            bathrooms: b.bathrooms,
            area: b.area,
            amenities: b.amenities,
            comments_from_user: b.comments_from_user,
            address: {
                line1: b.line1,
                line2: b.line2,
                city: b.city,
                state: b.state,
                country: b.country,
                zip: b.zip
            },
            LatLng: {
                latitude: b.latitude,
                longitude: b.longitude
            },
            picture: resolveBasePath()
        },
        function (err) {
            res.redirect('/properties/' + b.name);
        }
    );
};

exports.remove = function (req, res) {
    propertyModel.remove(
        {productName: req.params.name},
        function (err) {
            res.redirect('/properties');
        });
};

exports.home = function (req, res) {
    propertyModel.find({}, function (err, docs) {
        if (err) return res.render('Error occurred');
        res.render('index', {products: JSON.stringify(docs), routePath: "home", title: 'Product List - By Sandeep Pagi'});
    });
};

var results;
exports.search = function (req, res) {
    //Message if search fails
    var failedSearchMessage= "Could Not Find Any Properties matching Your criteria.Please Try again.";

    if(req.body.min_price == "" ||req.body.max_price == ""){
        req.body.min_price=0;
        req.body.max_price=1000000000000000000000;}
    if(req.body.prop_type == "" ){
        req.body.prop_type='';}

    //Query Database to find properties
    propertyModel.where('price').gte(req.body.min_price)
        .where('price').lte(req.body.max_price)
        .where('bedrooms',req.body.bedroom)
        .where('bathrooms',req.body.bathroom)
        .where('type').in([new RegExp(req.body.location,'i')])
        .where('type').in([new RegExp(req.body.prop_type,'i')])

        .exec(function (err, docs) {
            if (err) return res.render('Error occurred');
            console.log("Errors:"+ err);
            console.log("Docs:"+docs);
            results=docs;
            console.log("results in main search"+results);
            console.log('ZipCode:'+req.body.zipcode+"And is of type:===>"+(typeof req.body.zipcode));
            console.log('location:'+req.body.location);
            console.log('bedrooms:'+req.body.bedroom);
            console.log('bathrooms:'+req.body.bathroom);
            console.log('country:'+req.body.country);
            console.log('areaOfSearch:'+req.body.areaOfSearch);
            console.log('min_price:'+req.body.min_price);
            console.log('max_price:'+req.body.max_price);
            console.log('prop_type:'+req.body.prop_type);
            if(docs.length > 0){
                console.log("Not Failed"+docs.length);
                res.render('search', {products: JSON.stringify(docs), routePath: "map"});
            }else{
                console.log("Failed"+docs.length);
                res.render('index', {products:failedSearchMessage , routePath: "searchFailed"});
            }
        });
};

exports.map = function(req, res){
    res.render('index', {products:JSON.stringify(results), routePath: "map"});
};

exports.searchList =function(req,res){
    console.log("results in searchLink"+results);
    res.render('search', {products:JSON.stringify(results), routePath: "searchList"});
};

exports.getsearch =function(req,res){
    console.log("results in getsearch"+results);
    res.render('search', {products:JSON.stringify(results), routePath: "map"});
};