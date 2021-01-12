var https = require('https');
var fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const options = {
  hostname: 'api.fpt.ai',
  path: '/hmi/tts/v5',
  headers: {
    'api-key': '4xBHmsnsiW2e4kmFCQvN5txe4erz7Stt',
    'speed': '0',
    'voice': 'banmai',
    'callback_url': 'http://35.196.95.74/update/audio'
  },
  method: 'POST'
};



exports.ConvertAudio = function(content){
  var httpreq = https.request(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log("body: " + chunk);
    });
    response.on('end', function() {
      console.log('ok', response);
    })
    console.log(response);
  });
  httpreq.write(content);
  httpreq.end();
};

exports.downloadAudio = function(dir, fileName, url)
{
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var path = dir + '/' + fileName;
    var file = fs.createWriteStream(path);
    https.get(url, function(response) {
        response.pipe(file).on('finish', ()=>{
          if ( dir != "Data/TheGioiHoanMy" && !fs.existsSync(dir + '/Fix')){
            fs.mkdirSync(dir + '/Fix');
        }
          var path2 =  dir == "Data/TheGioiHoanMy" ? ("Data/Fix/"  + fileName) : (dir + '/Fix/' + fileName);
          ffmpeg(path).audioCodec('copy').output(path2).on('error', function(err) {
            console.log('An error occurred: ' + err.message);
          }).run();
        });
    });
}

exports.fixAudio = function(source, des) {
  ffmpeg(source).audioCodec('copy').output(des).on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  }).run();
}
exports.getSourcePosition = function(files,search){
  for (let i = 0; i < files.length; i++) {
    const element = files[i];
    if(element.indexOf(search) != -1){
      return i;
    }
  }
  return 0;
}

exports.sortListFiles = function(listFile){
  for (let i = 0; i < listFile.length-1; i++) {
    for (let j = i; j < listFile.length; j++) {
      if(getActualPosition(listFile[i]) > getActualPosition(listFile[j]))
      {
        var temp = listFile[i];
        listFile[i] = listFile[j];
        listFile[j] = temp;
      }
    }
  }
  return listFile;
}
function getActualPosition(fileName)
{
  var temp = fileName.replace('Chuong','').replace('chuong','').replace('.mp3','').trim();
  return parseInt(temp, 10);
}

exports.removeUniCode = function RemoveUniCode(target) {
    var temp = target.replace(' ','');
    var data = {
      a: 'ạảãàáâậầấẩẫăắằặẳẵ',
      o: 'óòọõỏôộổỗồốơờớợởỡ',
      e: 'éèẻẹẽêếềệểễ',
      u: 'úùụủũưựữửừứ',
      i: 'íìịỉĩ',
      y: 'ýỳỷỵỹ',
      d: 'đ',
      A: 'ẠẢÃÀÁÂẬẦẤẨẪĂẮẰẶẲẴ',
      O: 'ÓÒỌÕỎÔỘỔỖỒỐƠỜỚỢỞỠ',
      E: 'ÉÈẺẸẼÊẾỀỆỂỄ',
      U: 'ÚÙỤỦŨƯỰỮỬỪỨ',
      I: 'ÍÌỊỈĨ',
      Y: 'ÝỲỶỴỸ',
      D: 'Đ'
    }
    Object.keys(data).map(function(key){
      var rep = Array.from(data[key]);
      rep.forEach(element => {
        temp = temp.replace(element, key);
      });
    });
    return temp;
  };

  exports.crashPointFromHash = function(serverSeed) {
    var hash = crypto.createHmac('sha256', serverSeed).update(clientSeed).digest('hex');

    // In 1 of 101 games the game crashes instantly.
    if (divisible(hash, 101))
        return 0;

    // Use the most significant 52-bit from the hash to calculate the crash point
    var h = parseInt(hash.slice(0,52/4),16);
    var e = Math.pow(2,52);

    return Math.floor((100 * e - h) / (e - h));
};