const router = require('express').Router();
const { Comment } = require ('../../models');
const withAuth = require('../../utils/auth');

// GET endpoint to retrive all comments from database
router.get('/', (req, res) => {
    Comment.findAll ({}) // Empty object passed as an arguement as there are not conditions for this query and will return all records from Comment table
    .then(data => res.json(data))
    .catch (err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// GET route to retrieve a single comment by its id
router.get('/:id', (req, res) => {
    Comment.findAll({
        where: {
            id: req.params.id
        }
    })
    .then(commentData => res.json(commentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

// POST route to create a new comment with the given text requiring authentication with withAuth middleware
router.post('/', withAuth, (req, res) => {

    if(req.session.logged_in) { // Check if session exists, if so create method is used 
        Comment.create({
            text: req.body.text,
            post_id: req.body.post_id,
            user_id: req.session.user_id,
        })
        .then(commentData => {
            console.log(commentData)
            res.json(commentData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    }

    // res.redirect(`/post/${req.body.post_id}`);rs
});

// PUT route to update an existing comment with the given id requiring authentication 
router.put('/:id', withAuth, (req, res) => {
    Comment.update({
        text: req.body.text
    },
    {
        where: {
            id: req.params.id
        }
    })
    .then (commentData => {
        if(!commentData) {
            res.status(404).json({ message: 'A comment with this ID could not be found'});
            return;
        }
        res.json(commentData);
    }).catch (err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE route to delete a specific post requiring authentication
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then (commentData => {
        if(!commentData) {
            res.status(404).json ({ message: 'A comment with this ID could not be found' });
            return;
        }
        res.json({ message: 'Comment successfully deleted' });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;

