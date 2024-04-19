import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 } from 'aws-cdk-lib'

export class TsStrarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new aws_s3.Bucket(this, 'TsBucket', {
      lifecycleRules: [{
        expiration: cdk.Duration.days(3)
      } ]
    })

    new cdk.CfnOutput(this,
      "TsBucketName", {
        value: bucket.bucketName
      }
    )

  }
}
