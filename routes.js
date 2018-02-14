const pug = require('pug')
const crypto = require('crypto')

const PageSchema = require('./models/page')


module.exports = function(app) {

  app.get('/', function(req, res){
    const newPage = crypto.randomBytes(8).toString('hex')
    return res.redirect(307, '/' + newPage);
  });

  // Moving URL
  app.get('/:path', (req, res) => {

    // get path param
    const path = req.params.path

    // hash path
    const hash = crypto.createHash('sha256');
    hash.update(path);
    let digest = hash.digest('hex')

    // check for hash in mongo
    PageSchema.findOne({digest: digest})
      .then(result => {

        // if page exists return 404
        if(result){

          return res.status(404).send(pug.renderFile('./pugTemplates/404.pug'))

        } else {

          const birthday = new Date()
          const data = {
            path: path,
            digest: digest,
            birthDate: birthday,
            birthday: birthday.toString(),
            bytes: crypto.randomBytes(1024*10).toString('hex'),
          }

          const page = new PageSchema(data)
          return page.save()
            .then(savedData => {
              res.send(pug.renderFile('./pugTemplates/main.pug', data))
            })

        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).send(error)
      })

  })

  // All other routes should 404
  app.get('/*', function(req, res){
    res.status(404).send(pug.renderFile('./pugTemplates/404.pug'))
  });

};
