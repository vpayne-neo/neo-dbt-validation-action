export const sqlPatternOne = `
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

export const sqlPatternThree = `
with test as (
    select
    test1,
    test2,
    test3,
    test4,
    test5,
    test6
        
    from {{ ref('test_identifications') }}
)
 test_tables2 as (
    select
        test1,
        test2,
        test3,
        test4,
        test5,
        test6,
        test7

        from {{ ref('second_test_ref') }}
)

 test_table3 as (
    select 
        success1,
        success2,
        success3,
        success4,
        success5,
        success6,
        success7

        from {{ ref('third_test_ref') }}
)

select * from test_table3
`
