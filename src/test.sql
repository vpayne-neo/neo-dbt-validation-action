{{ config( materialized='ephemeral' ) }}

with stg_application_service__adjudication_reports as (
    select
        userId,
        version as adjudicationReportVersion,
        _id as adjudicationReportId,
        DTI as adjudicationReportDTI,
        creditScore as adjudicationReportCreditScore,
        employmentStatus as adjudicationReportEmploymentStatus,
        monthsEmployed as adjudicationReportMonthsEmployed,
        result as adjudicationReportResult,
        scenario as adjudicationReportScenario,
        cast(creditLimitCents as bigint) as adjudicationReportCreditLimitCent,
        to_timestamp(updatedAt) as adjudicationReportUpdatedAt,
        to_timestamp(createdAt) as adjudicationReportCreatedAt
    from
        {{ source( "applicationService", "adjudicationReports" ) }}
)

select * from stg_application_service__adjudication_reports
