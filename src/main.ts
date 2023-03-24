import * as core from '@actions/core'
import {wait} from './wait'
const {Parser} = require('node-sql-parser')

const parseOptions = {
  database: 'Hive'
}
async function run(): Promise<void> {
  const parser = new Parser()

  const someSQL = `
  
`
  const parseDbtAsNativeSql = (dbtSQL: string): string => {
    let sql = dbtSQL
    // const reg = new RegExp(/^(?<=config().*?(?=))$/)

    sql = sql.replace(/^.*{%-.*$/gm, '')
    sql = sql.replace(/^.*{%.*$/gm, '')
    sql = sql.replace(/^.*{%+.*$/gm, '')
    sql = sql.replace(/^.*where.*$/gm, '')
    sql = sql.replace(/^.*{{.*$/gm, '')
    sql = sql.replace(/^.*}}.*$/gm, '')
    sql = sql.replace(/^.*with.*$/gm, '')

    sql = sql.replace(/\n/g, ' ')

    sql = sql.replace(/config\(.*?[^\)]\)/g, '')
    sql = sql.replace(')', '')
    sql = sql.replace('select *', '')
    const selectCount = (sql.match(/select/g) || []).length
    if (selectCount > 1) {
      for (let i = 0; i < selectCount; i++) {
        sql = sql.replace('select', 'SELECT')
      }
    }
    const fromCount = (sql.match(/from/g) || []).length
    if (fromCount > 1) {
      for (let i = 0; i < fromCount; i++) {
        sql = sql.replace('from', 'FROM')
      }
    }
    const startBrakCount = (sql.match(/\(/g) || []).length
    if (startBrakCount > 1) {
      for (let i = 0; i < startBrakCount; i++) {
        sql = sql.replace('(', '')
      }
    }
    const endBrakCount = (sql.match(/\)/g) || []).length
    if (endBrakCount > 1) {
      for (let i = 0; i < endBrakCount; i++) {
        sql = sql.replace(')', '')
      }
    }
    console.log(sql)
    return sql
  }

  parseDbtAsNativeSql(someSQL)

  // const sqlToObject = parser.astify(parseDbtAsNativeSql(someSQL))
  // const numberOfColumns: number = sqlToObject.columns.length
  // console.log(sqlToObject)
  // console.log(`Columns # ${numberOfColumns}`)

  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
