import { parser } from "./jsml";

console.log(
  JSON.stringify(
    parser.parse(`
      <application user-is-dead=true user={ first: "Steve", last: "Jobs" }>
        <activity name="WWDC 2021" datetime={
          date: { month: 6, date: 7 },
          time: { hour: 10, minute: 0, second: 0 },
          timezone: "PDT"
        }>
          {
            description: "The Apple Worldwide Developers Conference",
            schedule: 
              <Sessions>
                <Session name="Keynote"></Session>
                <Session name="Platforms State of the Union" />
                <Session name="Create 3D models with Object Capture" />
                {
                  tag: "Session", 
                  attrs: { name: "Monday WWDC21" } 
                }
              </Sessions>
          }
        </activity>
      </application>
    `),
    null,
    2
  )
);
