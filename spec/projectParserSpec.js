describe('ProjectParser', function() {
	var projectParser;
	var response = { "expand" : "projects",
  "link" : { "href" : "http://master.cd.vpc.realestate.com.au/rest/api/latest/project",
      "rel" : "self"
    },
  "projects" : { "expand" : "project",
      "max-result" : 1,
      "project" : [ { "expand" : "plans",
            "key" : "BAMBOOSYSTEM",
            "link" : { "href" : "http://master.cd.vpc.realestate.com.au/rest/api/latest/project/BAMBOOSYSTEM",
                "rel" : "self"
              },
            "name" : "Bamboo System",
            "plans" : { "expand" : "plan",
                "max-result" : 2,
                "plan" : [ { "actions" : { "max-result" : 7,
                          "size" : 7,
                          "start-index" : 0
                        },
                      "averageBuildTimeInSeconds" : 1679.0,
                      "branches" : { "max-result" : 0,
                          "size" : 0,
                          "start-index" : 0
                        },
                      "description" : "Start the bamboo EC2 agents after being shutdown overnight",
                      "enabled" : true,
                      "expand" : "actions,stages,branches",
                      "isActive" : false,
                      "isBuilding" : false,
                      "isFavourite" : false,
                      "key" : "BAMBOOSYSTEM-START",
                      "link" : { "href" : "http://master.cd.vpc.realestate.com.au/rest/api/latest/plan/BAMBOOSYSTEM-START",
                          "rel" : "self"
                        },
                      "name" : "Bamboo System - Start agents",
                      "projectKey" : "BAMBOOSYSTEM",
                      "projectName" : "Bamboo System",
                      "shortKey" : "START",
                      "shortName" : "Start agents",
                      "stages" : { "max-result" : 1,
                          "size" : 1,
                          "start-index" : 0
                        },
                      "type" : "chain"
                    },
                    { "actions" : { "max-result" : 7,
                          "size" : 7,
                          "start-index" : 0
                        },
                      "averageBuildTimeInSeconds" : 286.0,
                      "branches" : { "max-result" : 0,
                          "size" : 0,
                          "start-index" : 0
                        },
                      "description" : "Only run a subset of agents out of hours to avoid wasting money on idle resources",
                      "enabled" : true,
                      "expand" : "actions,stages,branches",
                      "isActive" : false,
                      "isBuilding" : false,
                      "isFavourite" : false,
                      "key" : "BAMBOOSYSTEM-STOPSOMEAGENTS",
                      "link" : { "href" : "http://master.cd.vpc.realestate.com.au/rest/api/latest/plan/BAMBOOSYSTEM-STOPSOMEAGENTS",
                          "rel" : "self"
                        },
                      "name" : "Bamboo System - Stop extra agents after 7pm weekdays",
                      "projectKey" : "BAMBOOSYSTEM",
                      "projectName" : "Bamboo System",
                      "shortKey" : "STOPSOMEAGENTS",
                      "shortName" : "Stop extra agents after 7pm weekdays",
                      "stages" : { "max-result" : 1,
                          "size" : 1,
                          "start-index" : 0
                        },
                      "type" : "chain"
                    }
                  ],
                "size" : 2,
                "start-index" : 0
              }
          }
          ],
      "size" : 1,
      "start-index" : 0
    }
}

	it('should parse response into projects', function() {
		var expectedProject = [new Project({
			name: "Bamboo System",
			key: "BAMBOOSYSTEM",
			plans: [{
					name: "Bamboo System - Start agents",
					key: "BAMBOOSYSTEM-START",
					href: "http://master.cd.vpc.realestate.com.au/rest/api/latest/plan/BAMBOOSYSTEM-START"	
				},
				{
					name: "Bamboo System - Stop extra agents after 7pm weekdays",
					key: "BAMBOOSYSTEM-STOPSOMEAGENTS",
					href: "http://master.cd.vpc.realestate.com.au/rest/api/latest/plan/BAMBOOSYSTEM-STOPSOMEAGENTS"	
				}
			]
		})];
		projectParser = new ProjectParser();
		expect(JSON.stringify(projectParser.parse(response))).toEqual(JSON.stringify(expectedProject));
	})
})