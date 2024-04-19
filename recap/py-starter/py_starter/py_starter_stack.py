from aws_cdk import (
    aws_s3,
    Stack,
    Duration,
    CfnOutput
)
from constructs import Construct

class PyStarterStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.bucket = aws_s3.Bucket(self, "PyBucket",
            lifecycle_rules=[
                aws_s3.LifecycleRule(
                    expiration=Duration.days(3)
                )
            ]                        
        )

        CfnOutput(self, "PyBucketName",
                  value=self.bucket.bucket_name
                  )


