const { Router } = require("express");

const Image = require('../models/Image');

const router = Router();

const path = require('path');

const { unlink } = require('fs-extra');

//Ruta inicial
router.get('/', async (req, res) => {
    const images = await Image.find().sort({date:'desc'})
    .then(imgsItem => {
        const obj = {
            images:imgsItem.map(item => {
                return{
                    id:item._id,
                    title:item.title,
                    description:item.description,
                    path:item.path,
                    created_at:item.created_at
                }
            })
        }
        const images = obj.images;
        res.render('index',{images});
    })
});

//Ruta del formulario para subir img
router.get('/upload', (req, res) => res.render('upload'));

//Ruta donde se valida los datos del form y se sube a mongodb
router.post('/upload', async (req, res) => {
    const image = new Image()
    image.title = req.body.title
    image.description = req.body.description
    image.filename = req.file.filename
    image.path = '/img/uploads/'+req.file.filename
    image.originalname = req.file.originalname
    image.mimetype = req.file.mimetype
    image.size = req.file.size

    await image.save();

    res.redirect('/');
});

//Ruta para ver el perfil de una imagen, pasándole el id
router.get('/image/:id', async (req, res) => {
    const image = await Image.findById(req.params.id)
    .then(data => {
        return{
            id:data.id,
            title:data.title,
            description:data.description,
            path:data.path,
            created_at:data.created_at
        }
    })
    res.render('profile',{image});
});

//Ruta donde se va a eliminar la imagen, pasando el id
router.get('/image/:id/delete', async (req, res) =>{
    const image = await Image.findByIdAndDelete(req.params.id);
    await unlink(path.resolve('./src/public'+image.path));
    res.redirect('/');
});


module.exports = router;