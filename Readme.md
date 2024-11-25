# Rj cart

an E-commerce Website built with MERN Stack
<ul>
  <li>It focuses on covering Authentication Mechanisms</li>
  <li>It focuses on covering Authorization Techniques</li>
  <li>It also covers Role based Access Control for Admin Panel</li>
</ul>

## Instructions

after cloning, run this command in the root folder
```bash
npm install
```
navigate to "frontend" folder, run these commands 
```bash
npm install
npm run build
```
wait for application build
after that open the backend/config/config.env
and update the MongoDB connection string
```bash
...
DB_LOCAL_URI=mongodb://localhost:27017/RJcart
```

navigate back to "root" folder and run this command for loading demo data
```bash
npm run seeder
```

run this below command to run the app in production mode
```bash
npm run prod
```


## Test
open the http://localhost:8000 and test the 

