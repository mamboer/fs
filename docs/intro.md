# @aotu/fs ({{"" | npmPackage("version")}})

The `@aotu/fs` library promotes several useful file system
utilities which you cannot get from the offical [fs](https://nodejs.org/dist/latest-v8.x/docs/api/fs.html) module.

The most prevalent `@aotu/fs` utility is {{book.api.walk}},
which lets you traverse a directory and get its stuffs in a json tree.

<!--- Badges for CI Builds ---> 
[![Build Status](https://travis-ci.org/o2team/fs.svg?branch=master)](https://travis-ci.org/o2team/fs)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/bc05341458d04003b781d01c3e1feac8)](https://www.codacy.com/app/mamboer/fs?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=o2team/fs&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/bc05341458d04003b781d01c3e1feac8)](https://www.codacy.com/app/mamboer/fs?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=o2team/fs&amp;utm_campaign=Badge_Coverage)
[![NPM Version Badge](https://img.shields.io/npm/v/@aotu/fs/latest.svg)](https://www.npmjs.com/package/@aotu/fs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## At a Glance

- {{book.guide.start}} ... installation and access

- {{book.guide.features}}:

  - {{book.guide.fnWalk}} ... using {{book.api.walk}}, traversing a specified directory and return a json tree.

  - {{book.guide.fnFlatten}} ... using
    {{book.api.flatten}}, traversing a specified directory and return an array.

- {{book.api.ref}} ... details the low-level functional API

- {{book.guide.dist}} ... where to find this utility **(and a local
  copy of the docs)**

- {{book.guide.history}} ... peruse various revisions

- {{book.guide.LICENSE}} ... legal stuff
