# Small host commands

## start backend
nohup java -jar improvement-app-backend-0.0.1-SNAPSHOT.jar --server.port=24568 -Xmx256m -Xms256m -XX:MaxMetaspaceSize=100m -Xss256k &