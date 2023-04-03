{{ config( materialized='ephemeral' ) }}

with stg_application_service__comply_advantage_report as (
    select
        _id as complyAdvantageReportId,
        userId,
        content as complyAdvantageReportContent,
        status as complyAdvantageReportStatus,
        to_timestamp(createdAt) as complyAdvantageReportCreatedAt,
        to_timestamp(updatedAt) as complyAdvantageReportUpdatedAt

    from
        {{ source( "applicationService", "complyAdvantageReports" ) }}
)

select * from stg_application_service__comply_advantage_report