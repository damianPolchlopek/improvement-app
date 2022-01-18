FROM openjdk:18-ea-11-jdk-alpine3.15
ADD target/workouts_app-0.0.1-SNAPSHOT.jar .
EXPOSE 8080
CMD java -Dserver.port=$PORT $JAVA_OPTS -jar workouts_app-0.0.1-SNAPSHOT.jar
