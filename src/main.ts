import * as core from '@actions/core'
import {wait} from './wait'
const {Parser} = require('node-sql-parser')

async function run(): Promise<void> {
  const parser = new Parser()

  const someSQL = `with credit_risk_application as (
    SELECT
        applicationId,
        productId,
        subProductId,
        applicationBrandId as brandId,
        tenantId,
        userId,
        customerId,
        accountId,
        applicationDecision as decision,
        applicationInReview as inReviewFlag,
        applicationStatus as status,
        applicationType,
        prequalificationId,
        prequalificationCreatedAt,
        prequalificationPreApprovalAmount,
        flaggedForDecline,
        flaggedForReapply,
        applicationFlaggedForManualReview as flaggedForManualReview,
        applicationFlaggedForManualReviewAt as flaggedForManualReviewAt,
        applicationManualReviewStatus as manualReviewStatus,
        applicationManualReviewDecision as manualReviewDecision,
        applicationManualReviewDecisionReason as manualReviewDecisionReason,
        applicationManualReviewDecidedAt as manualReviewDecidedAt,
        applicationCreatedAt as createdAt,
        applicationProcessingStartedAt as processingStartedAt,
        applicationCompletedAt as completedAt,
        applicationLastUpdatedAt as updatedAt
)`

  const ast = parser.astify(someSQL)
  console.log(ast)

  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
