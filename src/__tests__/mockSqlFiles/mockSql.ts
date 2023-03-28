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
with test_test_all as (
    select
    test1,
    test2,
    test3,
    test4,
    test5,
    test6
        named_struct(
            test1,
            test2,
            test3,
            test4,
            test5,
            test6
        ) as identifiedTest

    from {{ ref('test_identifications') }}
)

select * from test_all
`
