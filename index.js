'use strict'

const path = require('path')

function LicensesPlugin(conf) {
  this.options = Object.assign({
    acceptable: /Apache|BSD|MIT|ISC/,
    unacceptable: /unlicensed/i,
    selected: {},
    title: 'Licenses',
    filename: 'Licenses.txt',
    format: 'text',
    failWithError: true
  }, conf)
}

function selectLicenseForPackage(info, options) {
  let license

  if (options.selected[info.name]) {
    license = options.selected[info.name]
  } else if (info.license && info.license.match(options.acceptable)) {
    license = info.license
  } else if (info.licenses) {
    const l = info.licenses.find(t => t.type.match(options.acceptable))
    license = l ? l.type : null
  }

  if (options.failWithError) {
    if (!license ) {
      throw new Error(`Missing or unrecognized license for ${info.name}\n`)
    } else if (options.unacceptable && license.match(options.unacceptable)) {
      throw new Error(`Forbiddent license [${license}] for ${info.name}\n`)
    }
  }

  return license || 'UNKNOWN'
}

function generateTextFile(title, licenses, format) {
  let header
  let list

  if (format === 'markdown') {
    header = `# ${title}`
    list = licenses.map(l => `[${l.name}](${l.link}) licensed under ${l.license}`)
  } else {
    header = title
    list = licenses.map(l => `${l.name} licensed under ${l.license} (${l.link})`)
  }

  return [header].concat(list).join('\n\n')
}

LicensesPlugin.prototype.apply = function apply(compiler) {
  const vendors = require(path.join(compiler.context, 'package.json')).dependencies

  const licenses = Object.keys(vendors).map(name => {
    const info = require(path.join(compiler.context, 'node_modules', name, 'package.json'))
    const license = selectLicenseForPackage(info, this.options)
    const link = info.homepage || (info.repository && info.repository.url) || `https://www.npmjs.com/package/${v}`

    return { name, license, link }
  })

  compiler.plugin('emit', (compilation, cb) => {
    const result = generateTextFile(this.options.title, licenses, this.options.format)

    compilation.assets[this.options.filename] = {
      source: () => result,
      size: () => result.length
    }

    cb()
  })
}

module.exports = LicensesPlugin
