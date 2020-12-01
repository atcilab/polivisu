# Schoolstraten dashboard

The Schoolstraten dashboard https://schoolstraten.polivisu.eu/#/projects is a web platform aiming to make part of the school street safer by blocking part of the traffic. With this dashboard, local authorities, schools, parent associations and citizens can themselves contribute to measuring the effects of the introduction of a school street by mapping the traffic in and near the school street itself by measuring traffic themselves via the Telraam project. The dashboard provides a general map with all currently available school projects. As a user, you can get details for a school street project by checking the different diagrams that the dashboard provides.

The application is composed of a backend and a frontend part. The dashboard is based on two different backends. The first one is responsible for the school street projects management and the user authentication. Is NodeJS application that utilizes API to query and retrieve the relevant data from the database, pre-process that data and deliver customized data to the frontend. The database in this case is a NoSQL database called MongoDB. The frontend is built with Angular 9, responsible for the user interaction with the dashboard.

**Telraam API**: All the necessary data for the streets is provided by [Telraam](https://www.telraam.net/). The Telraam device is a combination of a Raspberry Pi microcomputer, sensors, and a low-resolution camera. The device is mounted on the inside of an upper-floor window with a view over the street. To send the traffic count data straight to the central database, the device needs a continuous Wi-Fi connection to the internet. Since the device is electrically powered, it also needs a power outlet within reach. The developers of the Telraam also provide us with an API that helps us to create the dashboard.

### Weather Data Collector Tool

Inside the API there is also a smaller tool that populates the database with data about the weather forecast.

![](https://i.imgur.com/upqAihS.png)

- The scheduler makes it possible to trigger the enhancer ever day at 12 AM UTC
- The enhancer receives raw data, processes it, and then imports the processed data into the database
- MongoDB is a schema less, NoSQL database
- OpenWeatherMap API is an open API that provides weather forecast information

The Open Weather Map (OWM) API is free on a basic plan and high-precision API. Their weather database is huge. You can use diverse metrics (e.g., temperature, humidity, air pollution, wind speed and degree, clouds percentage). You can also get a simple forecast, daily forecast, historical weather data, or use a city search.

The idea behind this tool came up when we saw that we needed some weather data that was in past months. OWM API will not provide us with data about past days. It gives you the option to buy specific dataset but that is not a solution for us, because with this option we would buy weather data every day.

In order to start using the OWM API we needed to get three important elements
**API key**: To get the key we needed to create an account on their website and generate a key.
**City’s ID**: The ID concerns the city we need to watch for the weather data. We get the ID by using their [search tool](https://openweathermap.org/find)
**API endpoint**: The API provides several endpoints but the right one for us is [this](https://api.openweathermap.org/data/2.5/forecast)

With these three elements, we created the tool which is a function that runs in specific date time each day and fetches data from their API and saves them into our database.

![](https://i.imgur.com/A0Kffcf.png)

Basically, what this function does is to make an HTTP request to the OWM API with some parameters. Then it filters out unwanted data from the response and inserts the data into our database with a specific format.

The OWM API returns an array of objects that looks like the following. Inside the list key there are 8 smaller objects (one record per 3 hours of day) that each one describes the weather for a specific hour of the day.

![](https://i.imgur.com/u0npQa2.png)

The previous function we have seen is wrapped inside a JavaScript file called **weather-app.js**.

![](https://i.imgur.com/zA7WfF7.png)

The **weather-app.js** file is a part of code of the API we've built for the **Schoolstraten project** which is deployed to the [Heroku](http://heroku.com/) platform. Inside the platform we have added a Scheduler plugin which is responsible to run a job in a specific datetime.

![](https://i.imgur.com/pj26J2e.png)

**User Management**: As mentioned, the Schoolstraten project is a web application that was built in order to keep safer by blocking part of the traffic. With that in mind, we needed to create an application that would allow users to register in the platform and be able to create projects.
For this kind of application, we have adapted the Role-Based Access Control (**RBAC**) approach. RBAC is an approach used to restrict access to certain parts of the system to only authorized users. The permissions to perform certain operations are assigned to only specific roles. Users of the system are assigned those roles, and through those assignments, they acquire the permissions needed to perform particular system functions. Since users are not assigned permissions directly, but only acquire them through the roles that have been assigned to them, management of individual user rights becomes a matter of simply assigning appropriate roles to a particular user. For this one, responsible is the admin of the platform. For the development of this web application, Angular 9, NodeJS, ExpressJS and MongoDB technologies were used.

As mentioned, we used MongoDB as the preferred database for this application and particular [mongoose](https://mongoosejs.com/) for data modeling. The following schema concerns the user model.

![](https://i.imgur.com/JM9TPkL.png)

In the code above, we've defined what fields should be allowed to get stored in the database for each user. Each user has a specific role and by default the selected role is the user which is the only role that has no privileges at all.

To implement the role-based access control in our application, we needed to have users in our application which we’ll grant access to certain resources based on their roles. All authentication and authorization logic is part of the **UserModel**. It follows the code used to register a new user into the application.

**Registration**: The web application sends an HTTP request to the API and firstly we ensure that the data that the user sent is what we need to continue with the registration. After this, we also check if the email already exists in our database. If so, we return a response that we inform the user that the given email is already in use, otherwise we continue with the saving of the User.

![](https://i.imgur.com/TucWUBB.png)

Before the **User is saved** in the database, the password is being hashed in order to secure the data. From the UI perspective, the registration is a simple form.

![](https://i.imgur.com/WptjFLb.png)

The code above, is responsible for the login of the user into the application. Firstly, it checks the input and then fetches the user based on the input he gave. If the user does not exist or the credentials are not the correct one the API returns a response with the error message, otherwise it generates a [JsonWebToken](https://jwt.io/) and returns a response with the token. From the web application perspective, the login is a simple form filling.

Upon the success of logging in, the JWT is being stored in the **localStorage** in order to be used for future requests to the API.

![](https://i.imgur.com/tJGgKzE.png)

The above code is part of the **AuthService** file that is part of the web application which is built in Angular 9.

**Auth Guard**: The auth guard is an angular route guard that's used to prevent unauthenticated or unauthorized users from accessing restricted routes, it does this by implementing the CanActivate interface which allows the guard to decide if a route can be activated with the canActivate() method. If the method returns true the route is activated (allowed to proceed), otherwise if the method returns false the route is blocked.
The auth guard uses the authentication service to check if the user is logged in, if they are logged. If they are logged in the canActivate() method returns true, otherwise it returns false and redirects the user to the login page.

**Role Guard**: The role guard does exactly the same work as the auth guard, but the role guard checks the user's role. If the user has not the required role to access a route then a modal informs the user that he/she has no access to that route, otherwise it lets the user continue.

![](https://i.imgur.com/9axXBAl.png)

Angular route guards are attached to routes in the router config, these auth and role guards are used in **project.module.ts** to protect the routes.

![](https://i.imgur.com/WpwUmK0.png)

**Token Interceptor**: The Token Interceptor intercepts http requests from the application to add a JWT auth token to the Authorization header if the user is logged in and the request is to the application API URL. It is implemented using the HttpInterceptor class included in the HttpClientModule, by extending the HttpInterceptor class we created a custom interceptor to modify http requests before they get sent to the server.

![](https://i.imgur.com/OSLdyUP.png)

**User Model**: The user model is an Interface that defines the properties of a user, including their role.

![](https://i.imgur.com/d4fE6te.png)

**Project Creation**: In order to create a new project, the user must be logged in and must have the role of a "Creator" or the "Admin". Note: There is only one admin.

The process to create a new project is as simply as filling in a form.

1. Click on the "Create Project" button
   There are two options, either the 1 which is a card that appears next to the currently listed projects or the 2 which is a link that appears in the navigation bar.

   ![](https://i.imgur.com/O7XJ9RJ.png)

2. Enter the school's information

   ![](https://i.imgur.com/MWFCsL5.png)

3. Add an image of the school

   ![](https://i.imgur.com/Im4DaRG.png)

4. Select the target school street and the impacted streets

   The target street is considering the road in front of the school's gate. This road segment will be closed the selected hours in (Step 5). As impact streets are considering the roads that will be affected by the closing of the target street

   ![](https://i.imgur.com/NQIkmGd.png)

   The selection of the streets is being made by clicking on the map the road segments (colored in green) we want to work with. After the selection, these streets will be available in the **Selected roads** card. The user can move these streets into the other two cards, by drag-n-drop the streets.
   _Note: It can only be one School street._

5. Select the active hours of the road closure

   ![](https://i.imgur.com/Qhobukx.png)

   By clicking the **Add** button next to the **Road Closures** a modal will be pop-up and then the user can add the hours per day that the target road will be closed. On **Save** the modal will close and the road closures will be updated.

   ![](https://i.imgur.com/0WnjT2M.png)

6. Save project: After these steps, the project is ready to be saved by clicking the **Save** button in the bottom right corner.

After saving the project, the service starts working by creating and sending an HTTP request to the API. Basically, on clicking the save button the **onSave()** function is executed which creates the project object with the input the user entered.

![](https://i.imgur.com/3IHHdKu.png)

This is how the web application works. From the API's perspective now. The API receives a request with the project object that was created in the front-end. When the request is being sent, the server checks if the user is authorized (check isAuthorized guard) and if the user is a creator (check **isCreator** guard). This means that two checks are being done.

_Reminder: Inside the JWT, there is information about the user, such as the email, the role, and etc_

- **First check** - Authorization check
  The server checks the Bearer token (JWT) that the front end sent, if the token exists and is not expired (tokens expire in 1 hour) then it proceeds on the second check, otherwise, a response with an error message returns to the user
- **Second check** - Privileges check
  After the authorization check, the server also checks the user's role. Only the "creator" and the "admin" roles have the privilege to create projects. If the user is either a "creator" or an "admin" the request proceeds, otherwise an error message returns to the user.

![](https://i.imgur.com/plySHd2.png)

Both the web application and the API support a full CRUD system with the same logic as the creation of a new project.

### Data Preparation

Chart.Js is a well-recognized JavaScript library, and It is used to represent the data using the HTML5 canvas. It allows us to build dynamic as well as static charts, and it comes with full animation support for the various charts. It takes data in the JSON form, so it is merely simple to use it with any programming language. In order to make easier to create the charts inside the Angular application, and not re-invented the will, we've also used module named ng2-charts.

The ng2-charts module is an open-source JavaScript library, and it is exclusively built for Angular 2+ and available via [npm](https://www.npmjs.com/). It helps to create eye-catching charts in Angular with the help of Chart.js. The ng2-charts supports Chart.js and comes with **baseChart** standard directive, and you can build 8 types of charts with it, such as: pie, bar, line, radar, polar area, doughnut, bubble, and scatter. The ng2-charts module has some properties that are required in order for the chart to be rendered.

- **data (ChartDataSets[])** - set of points of the chart and the label for the dataset which appears in the legend and tooltips.
- **labels (Label[])** - x axis labels. It is necessary for charts: line, bar and radar. And just labels (on hover) for charts: polarArea, pie and doughnut. Label is either a single string, or it may be a string[] representing a multi-line label where each array element is on a new line.
- **chartType (ChartType)** - indicates the type of charts, it can be: line, bar, radar, pie, polarArea, doughnut
- **colors (Color[])** - data colours, will use default and/or random colours if not specified
- **legend (Boolean = false)** - if true show legend below the chart, otherwise not be shown
- **options (ChartOptions)** - attributes same as chart.js central library specified in the documentation

Only three types of chart were used in the development of both dashboards. Line, Bar and Pie chart.

Line Chart: A line chart is a basic chart. It represents the data in a sequence of information with the small associated points called markers. Follows an example of a line chart for the Schoolstraten project.

![](https://i.imgur.com/oPwk7TI.png)

As we can see, the initial data is an empty array for both lineChartData and lineChartLabels. This is because the chart needs something to be rendered. Either is empty arrays or the final dataset. In our case, the data is collected from an external API named Telraam and they are coming preprocessed. So the work that we need to do is only to filter these data. For this action is responsible the **calculateData** function. This function accepts as input two arguments:

- **reports** - the data as they fetched from the API and
- **bikesBar** - represents the actual number of bikes in the target street

The **isActiveHour** function checks if the report (data that came from the API) is inside the active hour, which means that the time of the report the target street is closed. If so, the report is being pushed in the filteredReports array.

For the labels of the chart we just format the datetime of the report in the following format "**ddd D/M h a**" which will have as result "**mon. 24/8 8 am**".

This is the only data processing that both dashboards do regarding the data visualization with charts. Also, in order to render the chart, we need to add some code as a template.

![](https://i.imgur.com/J3oBfpg.png)

ng2-charts also allows us to add plugins on the chart and we have added two custom ones

- Weather forecast
- Project status indicator

_Note: These two plugins are only used in the **Schoolstraten** dashboard_

**Weather forecast** is a simple plugin that fetches the specific weather information from an external API named **OpenWeatherMap API** and creates an icon for it. Then it renders it on the chart as an icon.

![](https://i.imgur.com/j54ssrG.png)

**Status indicator** is another custom plugin for the chart that indicates the user if the school project has started or not.

![](https://i.imgur.com/4Qn7DjT.png)

The above code has as result the below chart:

![](https://i.imgur.com/2ZSEu4m.png)

The creation procedure of the other types of charts is also the same as the LineChart's one. The only difference is that we needed to update the chartType to **pie** and **bar** accordingly for the PieChart and BarChart in the template code of the Angular application.

### Technologies used

- Angular 9: Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations
- Leaflet: Leaflet is a widely used open source JavaScript library used to build web mapping applications.
- Ngx-bootstrap: ngx-bootstrap is an Open Source (MIT Licensed) which is a wrapper for Bootstrap. Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains CSS and JavaScript-based design templates for typography, forms, buttons, navigation, and other interface components
- Chart.js: Chart.js is a free open-source JavaScript library for data visualization, which supports 8 chart types: bar, line, area, pie, bubble, radar, polar, and scatter.
- NodeJS: Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser.
- ExpressJS: Express.js, or simply Express, is a web application framework for Node.js, released as free and open-source software under the MIT License. It is designed for building web applications and APIs. It has been called the de facto standard server framework for Node.js
- MongoDB: MongoDB is a cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas

### UI/UX

The user interface of the dashboard is built in this way that it can be used by everyone. It provides easy-to-read text with a quite large font size and with enough contrast that makes it easier to read the content. Additionally, the dashboard is fully responsive, and this means that it is easy to be accessed from any device.
