import * as fs from 'fs'

type SqlYmlFilePairs = {
  singleYml: boolean
  sqlAsString: string
  ymlFilePath: string
}

const createFilePairs = (
  sqlFilePaths: Array<string>,
  ymlFilePaths: Array<string>
): Array<SqlYmlFilePairs> => {
  return sqlFilePaths.map(sqlFile => {
    const yml = ymlFilePaths.find(yml =>
      yml.includes(sqlFile.replace('.sql', ''))
    )
    return {
      sqlAsString: fs.readFileSync(sqlFile, 'utf-8'),
      ymlFilePath: yml ?? ymlFilePaths[0],
      singleYml: yml ? false : true
    }
  })
}

export default createFilePairs
