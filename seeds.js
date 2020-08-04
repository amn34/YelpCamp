const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis culpa consectetur aliquam fuga in molestiae repellendus beatae natus ex fugiat, error saepe praesentium eligendi. Doloremque veritatis facilis dolorem commodi nemo."
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis culpa consectetur aliquam fuga in molestiae repellendus beatae natus ex fugiat, error saepe praesentium eligendi. Doloremque veritatis facilis dolorem commodi nemo."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis culpa consectetur aliquam fuga in molestiae repellendus beatae natus ex fugiat, error saepe praesentium eligendi. Doloremque veritatis facilis dolorem commodi nemo."
    }
]


function seedDB() {

    Comment.deleteMany({}, err => {
        if(err) {
            console.log(err);
        } else {
            console.log('removed comments');
        }
    });

    Campground.deleteMany({}, (err) => {
        // if(err) {
        //     console.log(err);
        // } else {
        //     console.log('removed campgrounds');
        //     data.forEach(seed => {
        //         Campground.create(seed, (err, campground) => {
        //             if(err) {
        //                 console.log(err);
        //             } else {
        //                 console.log('added a campground');
        //                 Comment.create({
        //                     text: 'This place is great, but I wish there was internet',
        //                     author: 'Homer'
        //                 }, (err, comment) => {
        //                     if(err) {
        //                         console.log(err);
        //                     } else {
        //                         console.log('create new comment')
        //                         campground.comments.push(comment);
        //                         campground.save();
        //                     }
        //                 });
        //             }
        //         });
        //     });
        // }
    });    
}

module.exports = seedDB;