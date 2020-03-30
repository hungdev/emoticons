require('dotenv').config()
const path = require('path');
const fs = require('fs');
const axios = require('axios');
var FormData = require('form-data');

//joining path of directory 
const directoryPath = path.join(__dirname, process.env.FOLDER);
//passsing directoryPath and callback function
fs.readdir(directoryPath, async function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  let arrRequest = []

  for (let file of files) {
    console.log(file.replace('.gif', ''));

    var form = new FormData();
    form.append('mode', 'data');
    form.append('name', file.replace('.gif', ''));
    form.append('token', process.env.TOKEN);
    form.append('_x_reason', 'customize-emoji-add');
    form.append('_x_mode', 'online');
    form.append('image', fs.createReadStream(path.join(__dirname, process.env.FOLDER, file)));
    const formHeaders = form.getHeaders();
    const rq = axios.post(`${process.env.URL}/api/emoji.add`, form, {
      headers: {
        ...formHeaders,
      },
    })
    arrRequest.push(rq)
  }


  Promise.all(arrRequest).then(function (values) {
    console.log(values);
  });


});

