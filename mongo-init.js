db.createUser(
        {
            user: "damian",
            pwd: "damian",
            roles: [
                {
                    role: "readWrite",
                    db: "workout-app"
                }
            ]
        }
);