import {join} from 'path'
import dir from '../../libs/dir'

let testDir = join(process.cwd(), 'test/fixtures')

dir.walk(testDir)
