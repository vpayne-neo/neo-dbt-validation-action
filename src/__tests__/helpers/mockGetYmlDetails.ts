import readYamlFile from 'read-yaml-file'

const mockGetYmlDetails = (filePath: string): Promise<Array<string>> => {
  return readYamlFile(filePath).then((data: any) => {
    const tables = data.sources[0].tables.map((table: any) => table)
    const ymlColumnNames: Array<string> = tables
      .flatMap((table: any) => table.columns)
      .map((column: any) => column.name)
      .sort()

    return ymlColumnNames
  })
}

export default mockGetYmlDetails
