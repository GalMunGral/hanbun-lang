import { parser } from "./jsml";

console.log(
  JSON.stringify(
    parser.parse(`
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
    `),
    null,
    2
  )
);
