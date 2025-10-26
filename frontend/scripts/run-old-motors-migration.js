#!/usr/bin/env node

/**
 * Script to run the old motors migration
 * Usage: npm run migrate:old-motors
 */

const {spawn} = require('child_process')
const path = require('path')

// Run the TypeScript file directly with ts-node
const scriptPath = path.join(__dirname, 'migrate-old-motors.ts')
const child = spawn('npx', ['ts-node', scriptPath], {
  stdio: 'inherit',
  cwd: process.cwd(),
})

child.on('exit', (code) => {
  process.exit(code)
})
