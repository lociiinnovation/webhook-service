# Verification Event Log [![Build Status](https://app.travis-ci.com/lociiinnovation/verification-event-log.svg?token=sdqeNfZrx1ZVo4wTsoTe&branch=master)](https://app.travis-ci.com/lociiinnovation/billing-and-metering-service) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A back end service to record all verification events. This service is deployed on the truuth.com organization's Amazon Web Service (AWS) account.

## Reminders when introducing changes to this codebase

1. Always refer to Truuth's [Software design standards](https://locii1.atlassian.net/wiki/spaces/SE/pages/31785037/Software+Development+Guide).

## Design Overview

1. The detailed design for the Billing and Metering Service is found [here](https://locii1.atlassian.net/wiki/spaces/SE/pages/1661501479/Metering+Solution+Design?focusedCommentId=1744240644#Key-Requirements).

## Services used

-   AWS Lambda
-   AWS Event Bus
-   AWS SQS
-   AWS SSM (parameter store)
-   AWS S3
-   AWS Cognito
-   AWS Cloudfront

## Service Dependencies

---

## To deploy

1. install serverless using npm (npm install --only=dev)
2. if on windows in VS code terminal type "Remove-Item alias:sls"
3. copy & paste AWS credentials.
4. type "sls deploy -s dev"

## Known Issues

None so far. XD

## Built With

-   [AWS](https://aws.amazon.com/) - The Cloud Provider
-   [Serverless](http://serverless.com/) - Serverless.com
-   [Typescript](https://www.typescriptlang.org/) - Typescript
