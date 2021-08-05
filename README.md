# Parser Combinator Tutorial

Let's parse this fairly arbitrary syntax

```
!Application user-is-dead=true user=( first -> "Steve". last -> "Jobs" )
  !Activity name="WWDC 2021" datetime=(
    date -> ( month -> 6. date -> 7 ).
    time -> ( hour -> 10. minute -> 0. second -> 0 ).
    timezone -> "PDT"
  )
    !Event
      description="The Apple Worldwide Developers Conference"
      schedule=(
          !Session name="Keynote"!.
          !Session name="Platforms State of the Union"!.
          !Session name="Create 3D models with Object Capture"!.
          (
            tag -> "Session".
            attrs -> ( name -> "Monday WWDC21" )
          )
      )!!!
```

into this tree structure:

```json
{
  "tag": "Application",
  "attrs": {
    "user-is-dead": true,
    "user": {
      "first": "Steve",
      "last": "Jobs"
    }
  },
  "children": [
    {
      "tag": "Activity",
      "attrs": {
        "name": "WWDC 2021",
        "datetime": {
          "date": {
            "month": 6,
            "date": 7
          },
          "time": {
            "hour": 10,
            "minute": 0,
            "second": 0
          },
          "timezone": "PDT"
        }
      },
      "children": [
        {
          "tag": "Event",
          "attrs": {
            "description": "The Apple Worldwide Developers Conference",
            "schedule": [
              {
                "tag": "Session",
                "attrs": {
                  "name": "Keynote"
                },
                "children": []
              },
              {
                "tag": "Session",
                "attrs": {
                  "name": "Platforms State of the Union"
                },
                "children": []
              },
              {
                "tag": "Session",
                "attrs": {
                  "name": "Create 3D models with Object Capture"
                },
                "children": []
              },
              {
                "tag": "Session",
                "attrs": {
                  "name": "Monday WWDC21"
                }
              }
            ]
          },
          "children": []
        }
      ]
    }
  ]
}
```
