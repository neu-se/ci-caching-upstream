#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const url = require('url');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let store = {};
const STORE_FILE = '/usr/local/lib/squid/store.json';

if (fs.existsSync(STORE_FILE)) {
  store = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
}

rl.on('line', (line) => {
  try {
    log("input: ", line);
    const link = line.trim().split(' ')[0].trim();
    log("input link: ", link);
    if (!link) {
      log("input link is empty!");
      return;
    }
    const hash = crypto.createHash('sha256').update(link).digest('hex');
    const urlObject = url.parse(link);
    if (store[hash]) {
      const filename = urlObject.pathname.split("/").splice(-1)[0];
      const redirectUrl = `http://host.docker.internal:3000/store/${hash}/${filename}`;
      log("Hash found. Redirecting to ", redirectUrl);
      console.log(redirectUrl);
      return;
    }
    log("Hash not found!");
    console.log();
  } catch (error) {
    log("Error line", line);
    log("Error", error);
    throw error;
  }
});

const log = (...message) => {
  const logMessage = `[${new Date().toISOString()}] ${message.join(" ")}\n`;
  fs.appendFile('/var/log/squid/redirect.log', logMessage, (error) => {
    if (error) {
      throw error;
    }
  });
};