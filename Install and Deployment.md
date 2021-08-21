# DoAn

LOCAL DEVELOPMENT GUIDELINE
1. Prerequisites
  - MongoDBCompass / Atlas
  - NodeJs (v10 or above), npm
  - Angular12, Nx

2. Setup Local Development Environment
  - Clone the project to local computer and go to the folder 
  ```
  git clone https://github.com/nshoa99/DoAn 
  ```
  - Run ```make setup``` to install dependencies and setup the local DB 
  - Or you can import DB by using the files (in folder Mongodb) provided.
  ```
  cd DoAn/backend
  npm start
  ```
  
  ```
  cd Doan/frontend
  nx serve admin --port 4200
  nx serve nshop --port 5200
  ```
  
  - You can change any port you prefer
 
