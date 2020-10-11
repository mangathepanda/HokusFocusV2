//Code taken from https://github.com/yan-foto/electron-pug thanks to kind soul who wrote it :)

'use strict'

const {protocol} = require('electron')
const fs = require('fs')
const path = require('path')
const pug = require('pug')
const mime = require('mime')
const EventEmitter = require('events')

const HTML_MIME = mime.getType('html')

class PugEmitter extends EventEmitter {}
const getPath = url => {
  let parsed = require('url').parse(url)
  let result = decodeURIComponent(parsed.pathname)
  if (process.platform === 'win32' && !parsed.host.trim()) {
    result = result.substr(1)
  }

  return result
}

const setupPug = (options = {}, locals) => (
  new Promise((resolve, reject) => {
    let emitter = new PugEmitter()

    protocol.interceptBufferProtocol('file', (request, result) => {
      let file = getPath(request.url)
      try {
        let content = fs.readFileSync(file)
        let ext = path.extname(file)
        let data = {data: content, mimeType: mime.getType(ext)}

        if (ext === '.pug') {
          let compiled = pug.compileFile(file, options)(locals)
          data = {data: Buffer.from(compiled), mimeType: HTML_MIME}
        }

        return result(data)
      } catch (err) {
        let errorData
        if (err.code === 'ENOENT') {
          errorData = -6
        } else if (typeof err.code === 'number') {
          errorData = -2
        } else {
          errorData = {data: Buffer.from(`<pre style="tab-size:1">${err}</pre>`), mimeType: HTML_MIME}
        }

        emitter.emit('error', err)
        return result(errorData)
      }
    }, err => err ? reject(err) : resolve(emitter))
  })
)

module.exports = setupPug