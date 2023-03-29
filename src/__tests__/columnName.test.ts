import {mockRemoveDbtFromSql, mockGetYmlDetails} from './helpers'
import {expect, test} from '@jest/globals'

test('Column names should match', async () => {
  const filePath = 'src/__tests__/mockYmlFiles/mockYml.yml'
  const sql = `
    with stg_test_testdb as (
        select
            test1,
            test2,
            test3,
            test4,
            test5,
            test6,
            test7
    
        from {{ source('test','testCAl') }}
    )
    
    select * from test_stg_test
    `
  const ymlDetails = await mockGetYmlDetails(filePath)
  const sqlToCompare = mockRemoveDbtFromSql(sql)

  expect(ymlDetails).toEqual(sqlToCompare)
})
