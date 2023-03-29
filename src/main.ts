import * as core from '@actions/core'
import {wait} from './wait'
const {Parser} = require('node-sql-parser')
import {isDeepStrictEqual} from 'util'
import getYmlDetails from './getYmlDetails'
import {differenceBy} from 'lodash'
import * as fs from 'fs'
import parseDbtAsNativeSql from './parseDbtasNativeSql'
import {getInput} from '@actions/core'

async function run(): Promise<void> {
  try {
    const paths = getInput('files')
    core.debug(paths)
    const sqlFilePaths = paths.split(' ').filter(sql => sql.includes('.sql'))

    const ymlFilePaths = paths.split(' ').filter(yml => yml.includes('.yml'))

    type SqlYmlFilePairs = {
      sqlAsString: string
      ymlFilePath: string
    }

    const filePairs: Array<SqlYmlFilePairs> = sqlFilePaths.map(sqlFile => {
      const yml = ymlFilePaths.find(yml =>
        yml.includes(sqlFile.replace('.sql', ''))
      )

      return {
        sqlAsString: fs.readFileSync(sqlFile, 'utf-8'),
        ymlFilePath: yml ?? ''
      }
    })

    filePairs.map(async pair => {
      const parser = new Parser()

      const sqlToObject = parser.astify(parseDbtAsNativeSql(pair.sqlAsString))
      const columnNames = sqlToObject.columns
        .map(
          (col: {
            expr: {
              type?: string
              table?: string
              column?: string
            }
            as?: string
          }) => `${col.as ?? col.expr.column}`
        )
        .sort()

      const ymlColumnNames = await getYmlDetails(pair.ymlFilePath)
      console.log(pair)
      const ymlColumnCount = ymlColumnNames.length
      const sqlColumnCount = columnNames.length
      console.log(
        ` Column names equal? : ${isDeepStrictEqual(
          ymlColumnNames,
          columnNames
        )}`
      )
      if (isDeepStrictEqual(ymlColumnNames, columnNames) == false) {
        const difference = differenceBy(columnNames, ymlColumnNames).map(
          diff => ` ${diff}`
        )
        const errorMsg = `Columns do not match =>> ${difference}`
        core.error(errorMsg)
      }

      throw new Error(
        ` Column count equal? : ${isDeepStrictEqual(
          ymlColumnCount,
          sqlColumnCount
        )}`
      )
    })
  } catch (err) {
    console.error(err)
    process.exit()
  }
}

run()
