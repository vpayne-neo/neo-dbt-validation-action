const {Parser} = require('node-sql-parser')

const mockRemoveDbtFromSql = (mockSql: string): Array<string> => {
  const parser = new Parser()
  const parseDbtAsNativeSql = (dbtSQL: string): string => {
    let sql = dbtSQL
    sql = sql.replace(/^.*{%-.*$/gm, '') // --
    sql = sql.replace(/^.*{%.*$/gm, '') //   |
    sql = sql.replace(/^.*{%+.*$/gm, '') //  --- Remove jinja from sql
    sql = sql.replace(/^.*--+.*$/gm, '') //--|

    const cteCount = (sql.match(/ as\s\(/g) || []).length // gets the count of how many cte's are in the sql

    if (cteCount > 1 && cteCount !== 0) {
      for (let i = 0; i < cteCount; i++) {
        sql = sql.replace(/\sas\s/, ' as').replace(/\n/g, ' ') // remove space after as for each cte and places string on one line
        const matchedCte = sql.match(/as\(.*?[^\)]from/)?.map(cte => cte)[0] // assigns current to variable

        sql = sql.replace(matchedCte ?? '', '')

        if (i == cteCount - 1) {
          // on the last cte we assign out matched cte to the sql variable
          sql = matchedCte ?? ''
          sql = sql?.replace('as(', '').replace('from', '')

          return sql
        }
      }
    } else {
      sql = sql.replace(/\sas\s/, ' as').replace(/\n/g, ' ') // remove space after as

      const selectStatement = sql.match(/as\(.*?[^\)]from/) //matches everythin between as( - from
      const selectWithoutAs = selectStatement // removes string from regex array and store in variable, then removes as(
        ?.map(select => select)[0]
        ?.replace('as(', '')

      const removeFrom = selectWithoutAs?.replace('from', '') //removes 'from' from the string
      sql = removeFrom ?? ''
      return sql
    }

    return "No CTE's found"
  }

  const sqlToObject = parser.astify(parseDbtAsNativeSql(mockSql))
  const columnNames = sqlToObject.columns
    .map(
      (col: {
        expr: {
          type?: string
          table?: string
          column?: string
        }
        as?: string
      }) => `${col.expr.column}` + (col.as ?? '')
    )
    .sort()
  return columnNames
  // This funtion reads a string and removes dbt patterns from it
}

export default mockRemoveDbtFromSql
