const Sauce = require('../models/sauce'); 

exports.getAllSauces = (req, res, next) => { 
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }))
};

exports.getOneSauce = (req, res, next) => { 
    Sauce.findOne({_id : req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error : error}))
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
    .catch( error => res.status(400).json({ error : error }))
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Modifié'}))
    .catch(()=> res.status(400).json({ error }))
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
    const userId = req.body.userId;

    if (like === 0) {
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
                { _id: req.params.id },
                {
                $pull: { usersLiked: req.body.userId },
                $inc: { likes: -1 },
                _id: req.params.id,
                }
            )
                .then(() => res.status(200).json({ message: 'Like retiré' }))
                .catch((error) => res.status(400).json({ error }));
            }
            if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
                { _id: req.params.id },
                {
                $pull: { usersDisliked: req.body.userId },
                $inc: { dislikes: -1 },
                _id: req.params.id,
                }
            )
                .then(() => res.status(200).json({ message: 'Dislike retiré' }))
                .catch((error) => res.status(400).json({ error }));
            } else {
            () => res.status(200).json({ message: 'Merci de nous donner votre avis' });
            }
        })
        .catch((error) => res.status(404).json({ error }));
    } else if (like === 1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
              $push: { usersLiked: userId },
              $inc: { likes: 1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Like ajouté' }))
            .catch((error) => res.status(400).json({ error }));
    } else {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $push: { usersDisliked: userId },
                $inc: { dislikes: 1 },
            }
            )
            .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
            .catch((error) => res.status(400).json({ error }));
    }
};