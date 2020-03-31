
require('dotenv').config()
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

function getList() {
  return new Promise(async (resolve, reject) => {
    let form = new FormData();
    form.append('page', 1);
    form.append('count', 100);
    form.append('token', process.env.TOKEN);
    form.append('_x_reason', 'customize-emoji-new-query');
    form.append('_x_mode', 'online');
    const formHeaders = form.getHeaders();
    try {
      const result = await axios.post(`${process.env.URL}/api/emoji.adminList`, form, {
        headers: {
          ...formHeaders,
        },
      })
      const list = result.data.emoji.filter(e => e.can_delete)
      const arrName = list.map(e => e.name)
      resolve(arrName)
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })

}


async function removeList() {
  const result = await getList()

  let arrRequest = []

  for (let file of result) {
    console.log(file.replace('.gif', ''));

    const form = new FormData();
    form.append('name', file);
    form.append('token', process.env.TOKEN);
    form.append('_x_reason', 'customize-emoji-remove');
    form.append('_x_mode', 'online');
    const formHeaders = form.getHeaders();
    const rq = axios.post(`${process.env.URL}/api/emoji.remove`, form, {
      headers: {
        ...formHeaders,
      },
    })
    arrRequest.push(rq)
  }


  axios.all(arrRequest).then(function (values) {
    console.log(values);
  });

}

removeList()

