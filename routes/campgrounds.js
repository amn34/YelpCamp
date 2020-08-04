const express = require('express');
const router = express.Router({mergeParams: true});
const middleware = require('../middleware');
const Campground = require('../models/campground');
const Comment = require('../models/comment');



//route to display all the campgrounds
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: campgrounds });
        }
    });
});

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

//CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    let newCampground = req.body.campground;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    newCampground.author = author;

    Campground.create(newCampground, (err, createdCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//SHOW - shows more info about one campground
router.get('/:id', function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash('error', 'Campground not found');
            res.redirect('back');
        } else {
            //render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//EDIT - show form to edit campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

//UPDATE - updates a campground in the db
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

//DESTROY - deletes campground from the db
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    })
});

module.exports = router;