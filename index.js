const express = require('express')
const lib = require('./lib');
const app = express();
const fs = require('fs');
const path = require('path');
const router = express.Router();
app.use(express.static('public'))
var DataBase = [];

router.get('/test', function (req,res) {
  res.send(JSON.stringify(DataBase));
});

router.get('/momo', function (req,res) {

    lib.fixAudio('C:/Users/COMPUTER/Desktop/test.mp3', 'Data/NNVH/Fix/ssss.mp3');
    res.send('OK');

});
router.get('/small', function (req, res) {
  console.log(req.url);
  res.sendfile(__dirname + '/small.html')
});
router.post('/update/audio', function (req, res) {
  try{
      const { headers, method, url } = req;
  
      let body = [];
      req.on('error', (err) => {
          console.error(err);
      }).on('data', (chunk) => {
          body.push(chunk);
      }).on('end', () => {
          try {
  
              body = Buffer.concat(body).toString();
              var data = JSON.parse(body);
              // res.send(body);
              var i = -1;
              for (let index = 0; index < DataBase.length; index++) {
                const element = DataBase[index];
                if(element.url == data.message){
                  var direction = lib.removeUniCode(element.direction);
                  var fileName = lib.removeUniCode(element.filename);
                  lib.downloadAudio(direction, fileName + '.mp3', data.message);
                  console.log('update: ' + fileName);
                  i = index;
                  break;
                }
              }
              if(i !== -1){
                DataBase.splice(i, 1);
              }

              console.log(DataBase.length);
              res.send('OK');
          } catch {
              res.send('error');
          }
         
      });
    
  }catch{
      res.send('ERROR');
  }
});

router.post('/addlist', function (req, res) {
  try{
      let body = [];
      req.on('error', (err) => {
          console.error(err);
      }).on('data', (chunk) => {
          body.push(chunk);
      }).on('end', () => {
          try {
  
              body = Buffer.concat(body).toString();
              var data = JSON.parse(body);
              // console.log(data);
              DataBase.push(data);
              console.log(DataBase.length);
              res.send('done');
          } catch {
              res.send('error');
          }
      });
    
  }catch{
      res.send('ERROR');
  }
});

router.get('/other/:dir/:id', function (req, res) {
  try{
      const range = req.headers.range;
      console.log(range);
      const filePath = path.join(__dirname, 'Data/' + req.params.dir + '/Fix/Chuong' + req.params.id);
      const stat = fs.statSync(filePath);
      const total = stat.size;
      res.writeHead(200, {
          'Content-Range': 'bytes ' + 0 + '-' + (total -1) + '/' + total,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'audio/mpeg',
          'Content-Length': stat.size
      });
  
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);

  }catch (err){
      res.send("ERROR");
  }
});

app.use(express.static(path.join(__dirname, '/Data/TMTT/Fix')));
app.use('/', router);
app.listen(process.env.PORT || 3000);