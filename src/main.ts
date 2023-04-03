import * as core from '@actions/core'
const {Parser} = require('node-sql-parser')
import {isDeepStrictEqual} from 'util'
import getYmlDetails from './getYmlDetails'
import {differenceBy} from 'lodash'

import parseDbtAsNativeSql from './parseDbtasNativeSql'
import {getInput} from '@actions/core'
import getYamlColumnNames from './getYamlColumnNames'

import createFilePairs from './createFilePairs'

async function run(): Promise<void> {
  try {
    const paths =
      'src/diff.yml src/test2.sql src/test.sql src/test4.sql src/test4.yml'
    // const paths = `src/test4.yml src/test4.sql`
    // const paths = getInput('files')
    core.debug(paths)

    const sqlFilePaths = paths.split(' ').filter(sql => sql.includes('.sql'))
    const ymlFilePaths = paths.split(' ').filter(yml => yml.includes('.yml'))

    const filePairs = createFilePairs(sqlFilePaths, ymlFilePaths)

    filePairs.map(async pair => {
      const parser = new Parser()

      const sqlToObject = parser.astify(parseDbtAsNativeSql(pair.sqlAsString))
      const sqlColumnNames = sqlToObject.columns
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

      if (pair.singleYml) {
        const ymlNames = getYamlColumnNames(pair.ymlFilePath)
        ymlNames.map(ymlN => {
          core.debug(
            ` Matching names : ${
              isDeepStrictEqual(ymlN.columnNames, sqlColumnNames)
                ? `${sqlColumnNames}`
                : 'No matching columns'
            }`
          )
        })
      } else {
        const ymlColumnNames = await getYmlDetails(pair.ymlFilePath)

        const ymlColumnCount = ymlColumnNames.length
        const sqlColumnCount = sqlColumnNames.length

        if (isDeepStrictEqual(ymlColumnNames, sqlColumnNames) == false) {
          const difference = differenceBy(sqlColumnNames, ymlColumnNames).map(
            diff => ` ${diff}`
          )
          const errorMsg = `Columns do not match =>> ${difference}`

          core.debug(`Column names equal: false`)

          throw new Error(errorMsg)
        }
        core.debug(`Column names equal: true`)
        core.debug(
          ` Column count equal? : ${isDeepStrictEqual(
            ymlColumnCount,
            sqlColumnCount
          )}`
        )
      }
    })
  } catch (err) {
    console.error(err)
    process.exit()
  }
}

run()
