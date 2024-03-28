import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { join } from 'path'
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LambdaIntegration, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';

export class TsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const imagesBucket = new Bucket(this, 'TS-ImagesBucket')

    const imageLambda = new NodejsFunction(this, 'Ts-ImageLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: (join(__dirname, '..', 'services', 'image.ts')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        BUCKET_NAME: imagesBucket.bucketName
      }
    })

    imagesBucket.grantReadWrite(imageLambda)

    imageLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ['*'],
      actions: ['bedrock:InvokeModel']
    }))

    const api = new RestApi(this, 'TS-ImageApi');

    const imageResource = api.root.addResource('image')

    const imageLambdaIntegration = new LambdaIntegration(imageLambda)

    imageResource.addMethod('POST', imageLambdaIntegration)

  }
}
