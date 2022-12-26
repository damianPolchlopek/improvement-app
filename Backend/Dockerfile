#FROM eclipse-temurin:17-jdk-alpine as builder
#WORKDIR /opt/app
#COPY .mvn/ .mvn
#COPY mvnw pom.xml ./
#RUN chmod +x mvnw
#RUN ./mvnw dependency:go-offline
#COPY ./src /.src
#RUN ./mvnw clean package
#
#FROM eclipse-temurin:17-jre-alpine
#WORKDIR /opt/app
#COPY --from=builder /opt/app/target/*.jar /opt/app/*.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "/opt/app/*.jar"]

#FROM openjdk:18-ea-11-jdk-alpine3.15
#ADD target/workouts_app-0.0.1-SNAPSHOT.jar .
#EXPOSE 8080
#CMD java -Dserver.port=$PORT $JAVA_OPTS -jar workouts_app-0.0.1-SNAPSHOT.jar

#FROM eclipse-temurin:17-jdk-alpine
#ADD /target/improvement-app-backend-0.0.1-SNAPSHOT.jar app.jar
#ENTRYPOINT ["java","-jar","/app.jar"]

FROM openjdk:18-ea-11-jdk-alpine3.15
ADD target/improvement-app-backend-0.0.1-SNAPSHOT.jar .
#EXPOSE 8080
CMD java -jar improvement-app-backend-0.0.1-SNAPSHOT.jar
