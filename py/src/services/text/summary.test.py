import json
from summary import handler

event = {
    "body": json.dumps(
        {
            "text": """
        Vincent was a jazzman, a saxophonist with a smooth, soulful sound that could melt the coldest of hearts. He had been playing the clubs and 
bars of the city for years, honing his craft and building a reputation as one of the best musicians in town.

Mia was an actress, a rising star with a talent for drama and a fierce determination to succeed. She had been working non-stop for the past few years, taking on any role she could get, no matter how small, in order to make a name for herself in the competitive world of Hollywood.

One night, Vincent and Mia crossed paths at a jazz club in the city. Vincent was playing a set with his band, and Mia was in the audience, 
sipping on a martini and enjoying the music. As soon as their eyes met, Vincent knew he was in trouble. Mia was the most beautiful woman he had ever seen, with piercing green eyes and long, curly hair that cascaded down her back like a golden waterfall.

Despite the fact that Mia was a celebrity and Vincent was just a struggling musician, they quickly hit it off. They talked for hours after 
the show, exchanging stories and laughter, and before long, they were inseparable.

As the weeks went by, Vincent and Mia found themselves spending more and more time together. They would go on long walks through the city, 
holding hands and talking about their dreams and aspirations. They would sit in Vincent's small apartment, listening to jazz records and drinking coffee until the early hours of the morning.

Despite their differences - Vincent was a struggling artist, while Mia was a successful celebrity - they found a deep connection in their shared passion for their craft. They inspired each other to work harder and push themselves to be the best they could be.

As the months passed, Vincent and Mia's relationship grew stronger. They began to talk about their future together, about the possibility of starting a family and building a life filled with love, laughter, and music.

But as their love for each other grew, so did the challenges they faced. Mia's career was taking off, and she found herself constantly on the road, filming in different locations and attending red carpet events.
    """
        }
    ),
    "queryStringParameters": {
        "points": "3"
    }
}

response = handler(event, {})

print(response)