import * as core from '@actions/core'
const {Parser} = require('node-sql-parser')
import {isDeepStrictEqual} from 'util'
import getYmlDetails from './getYmlDetails'
import {differenceBy} from 'lodash'
import * as fs from 'fs'
import parseDbtAsNativeSql from './parseDbtasNativeSql'
import {getInput} from '@actions/core'

async function run(): Promise<void> {
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
    try {
      const parser = new Parser()
      const parsedSql = parseDbtAsNativeSql(pair.sqlAsString)

      const sqlToObject = parser.astify(parsedSql)

      if (sqlToObject.columns == '*') {
        throw new Error(
          `Final CTE can not be "select *" at ${pair.sqlAsString}`
        )
      } else {
        const columnNames: Array<string> = sqlToObject.columns
          ?.map(
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
        core.debug(`${pair.sqlAsString} \n ${pair.ymlFilePath}`)

        const ymlColumnCount = ymlColumnNames.length
        const sqlColumnCount = columnNames.length
        core.debug(
          ` Column names equal? : ${isDeepStrictEqual(
            ymlColumnNames,
            columnNames
          )}`
        )
        if (isDeepStrictEqual(ymlColumnNames, columnNames) == false) {
          const difference = differenceBy(columnNames, ymlColumnNames).map(
            diff => ` ${diff}`
          )
          const errorMsg = `Columns do not match =>> at ${pair.ymlFilePath} Columns:  ${difference}`
          throw new Error(errorMsg)
        }

        core.debug(
          ` Column count equal? : ${isDeepStrictEqual(
            ymlColumnCount,
            sqlColumnCount
          )}`
        )
        core.debug(pair.ymlFilePath)
      }
    } catch (err: any) {
      throw new Error(pair.ymlFilePath + '\n' + err)
    }
  })
}

run()
