## Adobe COVID Challenge Series - Use Case 2: Collaboration Among Teachers and Students for Online Courses v1.0.

### Useful links

* Youtube demo video link: https://youtu.be/pe9v6J81j0Q
* Running application link: http://online-course-topcoder.herokuapp.com/
* Git repository link: https://github.com/pawan1773/online-course-topcoder
* Google analytics template link: https://analytics.google.com/analytics/web/template?uid=0gfK289bSoC5Obw8UQA2hA

### Technologies used
* Springboot 2.3.2.RELEASE
* Java 8
* Materialize css
* JavaScript
* HTML 5
* CSS
* Postgresql database

### Pages
* Login
* Registration
* Change Password
* View Course
* Upload PDFs
* View PDF list

### Prerequisites

* Get your client id to use PDF Embed API and ``private.key`` and ``pdftools-api-credentials`` to use PDF Tools API from [here](https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html?ref=getStartedWithServicesSDK#)
* To run locally, make sure Java 8 or higher, Maven, Postgresql is installed
* Database user must have write access


### How to set up

* Import submitted code as maven project into IDE or clone it from shared git repository link
* Navigate to ``src\main\resources``
* Replace existing ``private.key`` and ``pdftools-api-credentials`` with yours.
* Edit database related properties in ``applications.properties``

```$xslt
spring.datasource.url=jdbc:postgresql://<hostname>:<port>/<database_name>
spring.datasource.username=<username>
spring.datasource.password=<password>
```
* Application by default runs on port 8080. In case, port 8080 is not available on your local system, uncomment and edit below property ``applications.properties``

```$xslt
server.port=<your port number>
```
* Navigate to ``src\main\resources\static\js``
* Edit ``config.js`` and replace existing client id with newly generated client id.
* Edit ``analytics.js`` and replace tracking id in ``gtag('config', '<your_tracking_id>')``
* Navigate to ``src\main\resources\template``
* Edit ``index.html``. Go to bottom of the file. Inside first script tag, set your tracking id in  ``https://www.googletagmanager.com/gtag/js?id=<YOUR_TRACKING_ID>`` 
* Application is ready to deploy on any hosting services like Heroku. See [reference](https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html?ref=getStartedWithServicesSDK#)
* To run locally, you can directly run application from your IDE or using command prompt, navigate to the main project folder where ``pom.xml`` is present and execute command ``mvn clean install`` followed by ``mvn spring-boot:run``
* Inside ``src\main\resources``, there two files ``data.sql`` and ``schema.sql``  which consists of database scripts to create tables (drop-create) and insert required data for application to work. These are automatically execute on application startup.

### Notes
* As per official documents, PDF Embed API annotations are supported on Full Window embeded mode. See [here](https://www.adobe.io/apis/documentcloud/dcsdk/docs.html)
* Sized container view is also provided in application if user doesn't want to deal with comments at that moment.







