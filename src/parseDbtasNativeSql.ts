import {differenceBy} from 'lodash'

const parseDbtAsNativeSql = (dbtSQL: string): string => {
  // This funtion reads a string and removes dbt patterns from it
  let sql = dbtSQL
  sql = sql.replace(/^.*{%-.*$/gm, '') // --
  sql = sql.replace(/^.*{%.*$/gm, '') //   |
  sql = sql.replace(/^.*{%+.*$/gm, '') //  --- Remove jinja from sql
  sql = sql.replace(/^.*--+.*$/gm, '') //--|
  const singleYml = true
  const cteCount = (sql.match(/ as\s\(/g) || []).length // gets the count of how many cte's are in the sql
  if (singleYml) {
  }
  if (cteCount > 1 && cteCount !== 0) {
    for (let i = 0; i < cteCount; i++) {
      sql = sql.replace(/\sas\s/, ' as').replace(/\n/g, ' ')

      // remove space after as for each cte and places string on one line
      const matchedCte = sql.match(/as\(.*?[^\)]from/)?.map(cte => cte)[0] // assigns current cte to variable

      sql = sql.replace(matchedCte ?? '', '')

      if (i == cteCount - 1) {
        // on the last cte we assign out matched cte to the sql variable
        sql = matchedCte ?? ''

        sql = sql?.replace('as(', '')

        const columnJinja = sql?.match(/{{.*?[^]}}\sas/g)

        columnJinja?.map(jinja => (sql = sql?.replace(jinja, '')))

        sql = sql.concat(' ') //adds white space to end of string to make sure final "from " is matched
        sql = sql.replace('from ', '')

        return sql
      }
    }
  } else {
    sql = sql.replace(/\sas\s/, ' as').replace(/\n/g, ' ') // remove space after as and formats string on one line
    const selectStatement = sql.match(/as\(.*?[^\)]from\s/) //matches everythin between as( - from

    const selectWithoutAs = selectStatement
      ?.map(select => select)[0]
      ?.replace('as(', '') // removes string from regex array and store in variable, then removes as(

    sql = selectWithoutAs ?? ''

    const columnJinja = sql?.match(/{{.*?[^]}}\sas/g) // finds all occurences of column jinja and removes it while leaving column name
    columnJinja?.map(jinja => (sql = sql?.replace(jinja, '')))

    sql = sql?.replace('from ', '') //removes 'from' from the string
    return sql
  }

  return "No CTE's found"
}

export default parseDbtAsNativeSql
