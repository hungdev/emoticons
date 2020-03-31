require('dotenv').config()
const path = require('path');
const fs = require('fs');
const axios = require('axios');
var throttle = require('promise-ratelimit')(5000); //10s

var FormData = require('form-data');

//joining path of directory 
const directoryPath = path.join(__dirname, process.env.FOLDER);

const prefix = 'em'
//passsing directoryPath and callback function
fs.readdir(directoryPath, async function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  let arrRequest = []

  for (let i in files) {
    if (i < 600 && i > 580) {
      console.log(files[i].replace(/(.gif|.png|.jpg)/gi, ''));

      var form = new FormData();
      form.append('mode', 'data');
      form.append('name', `${prefix}-${files[i].replace(/(.gif|.png|.jpg)/gi, '')}`);
      form.append('token', process.env.TOKEN);
      form.append('_x_reason', 'customize-emoji-add');
      form.append('_x_mode', 'online');
      form.append('image', fs.createReadStream(path.join(__dirname, process.env.FOLDER, files[i])));
      const formHeaders = form.getHeaders();
      const rq = await axios.post(`${process.env.URL}/api/emoji.add`, form, {
        headers: {
          ...formHeaders,
        },
      })
      console.log('rq', rq && rq.data)
    }
    // arrRequest.push(rq)
  }


  // Promise.all(arrRequest).then(function (values) {
  //   console.log(values);
  // });
  // for (let i = 0; i < files.length; i++) {
  //   throttle().then(async function () {
  //     console.log('gooo')
  //     await arrRequest[i]
  //   });
  // }

});

