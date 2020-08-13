## Adobe COVID Challenge Series - Use Case 2: Collaboration Among Teachers and Students for Online Courses v1.0.

### Useful links

* Youtube demo video link: https://youtu.be/QSVByPNM22Q
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

* Import submitted code as maven project into IDE or clone it from shared git repository link.
* Navigate to ``src\main\resources``
* Replace existing ``private.key`` and ``pdftools-api-credentials`` with yours.
* Edit database related properties in ``applications.properties``.

```$xslt
spring.datasource.url=jdbc:postgresql://<hostname>:<port>/<database_name>
spring.datasource.username=<username>
spring.datasource.password=<password>
```
* Application by default runs on port 8080. In case, port 8080 is not available on your local system, uncomment and edit below property ``applications.properties``.

```$xslt
server.port=<your port number>
```
* Navigate to ``src\main\resources\static\js``.
* Edit ``config.js`` and replace existing client id with newly generated client id and you can also configure ``DELAY_INTERVAL``. Its value is set to 10 seconds
* Edit ``analytics.js`` and replace tracking id in ``gtag('config', '<your_tracking_id>')``.
* Navigate to ``src\main\resources\template``
* Edit ``index.html``. Go to bottom of the file. Inside first script tag, set your tracking id in  ``https://www.googletagmanager.com/gtag/js?id=<YOUR_TRACKING_ID>``.
* Application is ready to deploy on any hosting services like Heroku. See [reference](https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html?ref=getStartedWithServicesSDK#).
* To run locally, you can directly run application from your IDE or using command prompt, navigate to the main project folder where ``pom.xml`` is present and execute command ``mvn clean install`` followed by ``mvn spring-boot:run``.
* Inside ``src\main\resources``, there two files ``data.sql`` and ``schema.sql``  which consists of database scripts to create tables (drop-create) and insert required data for application to work. These are automatically execute on application startup. 


### Notes
* As per official documents, PDF Embed API annotations are supported on Full Window embeded mode. See [here](https://www.adobe.io/apis/documentcloud/dcsdk/docs.html).
* Sized container view is also provided in application if user doesn't want to deal with comments at that moment.
* File size to be uploaded is limited to 2MB.
* Website design is mobile responsive but features are limited. Comments are not supported in mobile view.
* Only teacher will be able to upload PDF.
* When the PDF is opened, whiteboard will appear below PDF view.

### Events captured
* LOGGED_IN_PERIOD: Time between login and logout.
* DOCUMENT_OPEN: Shows which file has been opened by a student.
* SCROLLED_THROUGH: When current page is equal to last page.
* DOCUMENT_DOWNLOAD: Shows which file has been downloaded by a student.
* DOCUMENT_PRINT: Shows which file has been downloaded by a student.
* READ_PAGE_CONTENT: Whether the student has read all the content on page.
* PAGE_TIME: How much time is spent by a student on a particular page.
* ASSIGNMENT_COMPLETED: When student put a comment with value completed.
* COMMENT_ADDED: Which student has added comment of which file.
* REPLIED_TO_COMMENT: Which student has replied to a comment.
* COMMENT_DELETED: Which student has deleted the comment.
* COMMENT_UPDATED: Which student has updated the comment.








