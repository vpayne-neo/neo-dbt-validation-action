import readYamlFile from 'read-yaml-file'

const getYmlDetails = (filePath: string): Promise<Array<string>> => {
  return readYamlFile(filePath).then((data: any) => {
    let tables

    if (data.models != undefined) {
      // checks to see if yml file is using sources or models
      tables = data.models[data.models.length - 1]

      const ymlColumnNames: Array<string> = tables.columns // models
        .map((column: any) => column.name)
        .sort()

      return ymlColumnNames
    } else {
      tables = data.sources[data.sources.length - 1].tables.map(
        (table: any) => table
      )

      const ymlColumnNames: Array<string> = tables // sources
        .flatMap((table: any) => table.columns)
        .map((column: any) => column.name)
        .sort()

      return ymlColumnNames
    }
  })
}

export default getYmlDetails
