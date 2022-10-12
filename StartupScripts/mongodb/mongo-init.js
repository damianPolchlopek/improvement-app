db.createUser(
	{
		user: "user_app",
		pwd: "user_app",
		roles: [
			{
				role: "readWrite",
				db: "workout-app"
			}
		]
	}
);

db = new Mongo().getDB("workout-app");