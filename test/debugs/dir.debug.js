const {join} = require('path')
const dir = require('../../libs/dir')

let testDir = join(process.cwd(), 'test/fixtures')

dir.walk(testDir)
