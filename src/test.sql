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