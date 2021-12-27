# improvement-app

Biblioteki do frontu:

react-router-dom@5
react-dom
formik
yup
axios
react-super-responsive-table

npm install --save bootstrap@^4.0.0-alpha.6  react-bootstrap@^0.32.1


Komendy dla dockera:

Docker:

# tworzenie obrazu
docker build -f Dockerfile -t react_proj:v1 .

#wyswietlanie obrazow
docker images

#uruchamianie obrazu
docker run -p 8000:8080 [id]

docker run -p 3000:3000 -i -t 309


Docker Compose:

#uruchamianie wszystkich obrazow
docker-compose up

docker-compose -f docker-compose.yml build