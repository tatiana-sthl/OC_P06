const Sauce = require('../models/sauce'); 

exports.getAllSauces = (req, res, next) => { 
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }))
};

exports.getOneSauce = (req, res, next) => { 
    Sauce.findOne({_id : req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }))
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;    
    const sauce = new Sauce({ 
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   
    });
    sauce.save() 
    .then( () => res.status(201).json({ message: 'Sauvegardé'}))
    .catch( error => res.status(400).json({ error }))
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Modifié'}))
    .catch(()=> res.status(400).json({ error}))
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1]; 
    sauce.deleteOne({_id: req.params.id}) 
    .then(()=> res.status(200).json({ message: 'Supprimé'}))
    .catch(error => res.status(400).json({ error}))
    });
};

exports.rateSauce = (req, res, next) => {
    const like = req.body.like;

    if(like === 1) {

        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id}) 
        .then(() => res.status(200).json({ message: 'Like' }))
        .catch(error => res.status(400).json({ error}))

    } else if (like === -1) {

        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id}) 
        .then(() => res.status(200).json({ message: 'Dislike' }))
        .catch(error => res.status(400).json({ error}))

    } else {
        Sauce.findOne( {_id: req.params.id})
        .then( sauce => {
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                 sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
                .then( () => res.status(200).json({ message: 'Annulation du like' }))
                .catch( error => res.status(400).json({ error}))
                }
                
            else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
                .then( () => res.status(200).json({ message: 'Annulation du dislike' }))
                .catch( error => res.status(400).json({ error}))
                }           
        })
        .catch( error => res.status(400).json({ error})) 
    }
};