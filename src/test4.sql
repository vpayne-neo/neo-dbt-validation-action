{%- if target.name != 'dev'  and target.name != 'staging' -%}

{{ config(alias = 'account') }}

{%- endif -%}

with growth_account as (
    select
        accountId,
        applicationId,
        productId,
        subProductId,
        tenantId,
        userId,
        customerId,
        programId,
        accountStatus as status,
        closeReason,
        accountCycleDay as cycleDay,
        accountChargeOffReason as chargeOffReason,
        intendedUse,
        accountInterestRatePercent as interestRate_test1,
        accountCashAdvanceRatePercent as cashAdvanceRate,
        accountOverlimitRatePercent as overlimitRate,
        {{ cents_to_dollars('accountCreditLimitCents') }} as creditLimitDollars,
        accountClosedAt as closedAt_utc,
        from_utc_timestamp(accountClosedAt, 'America/Edmonton') as closedAt_mst,
        accountOpenedAt as openedAt_utc,
        from_utc_timestamp(accountOpenedAt, 'America/Edmonton') as openedAt_mst,
        from_utc_timestamp(now(), 'America/Edmonton') as lastRefreshedAt_mst

    from {{ ref('core_accounts_all') }}
)

select * from growth_account
