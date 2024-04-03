#!/usr/bin/env python3
import os

import aws_cdk as cdk

from py.py_stack import PyStack


app = cdk.App()
PyStack(app, "PySummaryStack")

app.synth()
