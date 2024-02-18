#!/usr/bin/env node

import fs from 'fs'
import { globSync } from 'glob'

import { getTailwindConfig } from './config.js'
import { sortClasses } from './sorting.js'

async function main() {
  let { context } = await getTailwindConfig({})

  const tailwindEnv = { context }

  const pattern = process.argv[2]
  if (!pattern) {
    console.error('Please provide a glob pattern as the first argument.')
  } else {
    processFiles(pattern, tailwindEnv)
  }
}

function processFiles(pattern, tailwindEnv) {
  // console.log(`Processing files matching ${pattern}`)
  const files = globSync(pattern)
  if (files.length === 0) {
    console.log('No files matched.')
    return
  }

  for (let file of files) {
    // console.log(`Processing ${file}`)
    let html = fs.readFileSync(file, 'utf8')

    // Regex to find class attributes and their values
    const classRegex = /\bclass="([^"]+)"/g
    let match
    let changed = false
    while ((match = classRegex.exec(html)) != null) {
      const originalClasses = match[1]
      // console.log(`Original classes: ${originalClasses}`)
      const orderedClasses = sortClasses(originalClasses, { env: tailwindEnv })
      if (orderedClasses !== originalClasses) {
        changed = true
        // console.log(`Sorted   classes: ${orderedClasses}`)
      }
      // console.log('')
      const newClassAttr = `class="${orderedClasses}"`
      html =
        html.substring(0, match.index) +
        newClassAttr +
        html.substring(match.index + match[0].length)
    }
    if (changed) {
      fs.writeFileSync(file, html, 'utf8')
      console.log(`Reordered classes in ${file}`)
    }
    // console.log(`Processed ${file}`)
  }
}

main()
