from image import handler
import json

event = {
    "body": json.dumps({"description": "A beautiful sunset"})
}

response = handler(event, {})

print(response)