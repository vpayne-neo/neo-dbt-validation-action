with stg_test_testdb as (
    select
        secondTest1,
        secondTest2,
        secondTest3,
        secondTest4,
        secondTest5,
        secondTest6,
        secondTest7

    from {{ source('test','testCAl') }}
)

select * from test_stg_test