const express = require('express');
const router = express.Router({mergeParams: true});
const middleware = require('../middleware');
const Campground = require('../models/campground');
const Comment = require('../models/comment');


//NEW  - form to create a new comment
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: foundCampground});
        }
    });

});

//CREATE - creates a comment and adds to db
router.post('/', middleware.isLoggedIn, (req, res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
            res.redirect('/campground');
        } else {
            Comment.create(req.body.comment, (err, createdComment) => {
                if(err) {
                    req.flash('Something went wrong');
                    console.log(err);
                } else {
                    //add username and id to comment
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    //save comment
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    req.flash('success', 'Successfully created comment');
                    res.redirect(`/campgrounds/${foundCampground._id}`);
                }
            });
        }
    });
});

//EDIT - form to change comment text
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground) {
            req.flash('error', 'Campground not found');
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                res.redirect('back');
            } else {
                res.render('comments/edit', {campground_id: foundCampground._id, comment: foundComment});
            }
        });
    });
});


//UPDATE - changes text of comment in db
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

//DELETE - removes comment from db
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if(err) {
            req.flash('error', 'Comment could not be deleted');
            res.redirect('back');
        } else {
            req.flash('success', 'Comment successfully deleted');
            res.redirect(`/campgrounds/${req.params.id}`);    
        }
    });
});

module.exports = router;