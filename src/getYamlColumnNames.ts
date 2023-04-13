import * as fs from 'fs'
import * as yaml from 'js-yaml'

const getYamlTableNames = (filePath: string) => {
  const contents = fs.readFileSync(filePath, 'utf-8')

  const data: any = yaml.load(contents)
  const models = data.models.flatMap((mod: any) => mod) ?? []
  const ymlDataSeperated: Array<{
    columnNames: Array<string>
  }> = models.map((model: any) => {
    return {
      columnNames: model.columns
        .map((col: any) => col.name)
        .filter(
          (colNames: any) =>
            colNames !== '_v' && colNames !== '_id' && colNames !== '__v'
        )
        .sort()
    }
  })
  return ymlDataSeperated
}

export default getYamlTableNames
