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

    // check for valid path
    const path = req.params.path
    const birthday = new Date()

    // hash path
    const hash = crypto.createHash('sha256');
    let digest
    hash.update(path);
    digest = hash.digest('hex')

    // check for hash in mongo
    PageSchema.findOne({digest: digest})
      .then(result => {

        // if id, return 404
        if(result){

          return res.status(404).send(pug.renderFile('./pugTemplates/404.pug'))

        } else {

          const data = {
            path: path,
            digest: digest,
            birthDate: birthday,
            birthday: birthday.toString(),
            bytes: crypto.randomBytes(1024*6).toString('hex'),
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

  // All other routes should redirect to the index.html
  app.get('/*', function(req, res){
    res.status(404).send(pug.renderFile('./pugTemplates/404.pug'))
  });

};
