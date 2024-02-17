#!/usr/bin/env node

// @ts-check
// @ts-ignore
import * as astTypes from 'ast-types'
import jsesc from 'jsesc'
import lineColumn from 'line-column'
import * as prettierParserAngular from 'prettier/plugins/angular'
import * as prettierParserBabel from 'prettier/plugins/babel'
// @ts-ignore
import * as recast from 'recast'
import { getTailwindConfig } from './config.js'
import { getCustomizations } from './options.js'
import { loadPlugins } from './plugins.js'
import { sortClasses, sortClassList } from './sorting.js'
import { visit } from './utils.js'

// let base = await loadPlugins()

import fs from 'fs'
// import { glob } from 'glob';
import { globSync } from 'glob'

async function main() {
  let { context, generateRules } = await getTailwindConfig({})

  const tailwindEnv = { context }

  const pattern = process.argv[2]
  if (!pattern) {
    console.error('Please provide a glob pattern as the first argument.')
  } else {
    processFiles(pattern, tailwindEnv)
  }
}


function processFiles(pattern, tailwindEnv) {
  console.log(`Processing files matching ${pattern}`)
  const files = globSync(pattern)
  if (files.length === 0) {
    console.log('No files matched.')
    return
  }

  for (let file of files) {
    console.log(`Processing ${file}`)
    let html = fs.readFileSync(file, 'utf8')

    // Regex to find class attributes and their values
    const classRegex = /class="([^"]+)"/g
    let match
    while ((match = classRegex.exec(html)) != null) {
      const originalClasses = match[1]
      const newClasses = sortClasses(originalClasses, { env: tailwindEnv })
      const newClassAttr = `class="${newClasses}"`
      html =
        html.substring(0, match.index) +
        newClassAttr +
        html.substring(match.index + match[0].length)
    }

    fs.writeFileSync(file, html, 'utf8')
    console.log(`Processed ${file}`)
  }
}

main()
