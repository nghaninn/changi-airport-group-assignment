# Changi Airport Group Assignment

>Assignment backend is build on Rest API using API Gateway which triggers AWS Lmabda Function running on Node.JS.
>The project is wrap with Amplify for easy deployment.
>
>MySQL is the selected Database to cater to the need for GROUP BY feature.
>
>As the JD highlights and emphasise Lambda with Python coding, I have added a Rest API on Lambda with Python. (PS. first time)
>
>Unit Tests are included for Node.JS and Python.

----

# Project URLs
1. Backend  
   https://github.com/nghaninn/changi-airport-group-assignment (this repo)
2. Postman for Rest API  
   https://www.postman.com/bold-rocket-440422/workspace/changi-airport-group-assignment/overview

----

# Steps to Run the project

1. Clone this project

```bash
git clone git@github.com:nghaninn/changi-airport-group-assignment.git
```

2. Start a local MySQL database.  
If docker is available, otherwise you may follow the installation guide: https://docs.docker.com/compose/install/linux/
```bash
docker compose up
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Verify that the container is up
```bash
docker ps
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![docker-mysql](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/docker-mysql.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/docker-mysql.png)  

3. Access to Lambda Function Node.JS and install necessary packages

```bash
cd amplify/backend/function/changiRestAPI/src
yarn install
```

----
**Run Test Scripts first, before local server. So you don't have to populate data.**

----

4. **Test Script for Node.JS**  
   Exit local server (Ctrl + C)
   ```
   yarn test
   ```
   [![test-nodejs](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/test-nodejs.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/test-nodejs.png)  

  
5. **Start Local Server for Node.JS**  
    ```bash
    yarn dev
    ```

6. Clone the Postman locally from the url above  
   To test locally, ensure that the url variable is set to **{{url_local_node}}** not ~~{{url_node}}~~  

   Alternatively, run
```
curl localhost:3000/node/item
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Create Category, then create Item**

7. Task #1:  
   Create Category: Stationary  
   [![task1-category-create.png](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task1-category-create.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task1-category-create.png)  
   [![task1-category-result.png](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task1-category-result.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task1-category-result.png)  

   Create Item: Notebook  
   [![task1-item-create.png](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task1-item-create.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task1-item-create.png)  
   [![task1-item-result.png](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task1-item-result.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task1-item-result.png)  

8. Task #2:  
   Update first item updatedOn time to x year before.
   [![task2-item-update-time.png](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task2-item-update-time.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task2-item-update-time.png)  
   Filter date after the date above.  
   [![task2-filter-result.png](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task2-filter-result.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task2-filter-result.png)  

9. Task #3:  
   [![task3-category-all.png](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task3-category-all.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task3-category-all.png)  
   [![task3-category-specific.png](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task3-category-specific.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/task3-category-specific.png)  
   **Uses the same function, just with params key**
   
----

# Approximate man-hours taken
   [![project-time.png](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/project-time.png)](https://github.com/nghaninn/changi-airport-group-assignment/blob/main/image/project-time.png)  

----

# Other works
[Other Assignment](https://github.com/nghaninn/nghaninn/blob/main/projects/README.md)