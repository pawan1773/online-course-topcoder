## Adobe COVID Challenge Series - Week 5/8 - Get started with Embed API and Tools API.

## Useful links

* Youtube link for demo video: https://www.youtube.com/watch?v=seuK0bWH4Xs&feature=youtu.be

## Execute

* The CLI tool takes two arguments. First as path to html zip and second as output pdf path and display errors on console in case of any error. You can also replace dc-services-sdk-credentials private key if usage exceeded. Below is the syntax:


```$xslt
mvn -f pom.xml exec:java -Dexec.mainClass=com.topcoder.challenge.StaticHTMLToPDF -Dexec.args="html_zip_path pdf_output_path"
```
* Sample command (if zip is present within the pdf_creator directory)

```$xslt
mvn -f pom.xml exec:java -Dexec.mainClass=com.topcoder.challenge.StaticHTMLToPDF -Dexec.args="static_html.zip pdfFromHTML.pdf"
```

* Sample command (if zip is not within the pdf_creator directory, you need to either pass full absolute path or relative path)


```$xslt
mvn -f pom.xml exec:java -Dexec.mainClass=com.topcoder.challenge.StaticHTMLToPDF -Dexec.args="../../folder_1/static_html.zip pdfFromHTML.pdf"
```

---------------------------------------------------------------------------------------------------

```$xslt
mvn -f pom.xml exec:java -Dexec.mainClass=com.topcoder.challenge.StaticHTMLToPDF -Dexec.args="C:\Users\topcoder\Desktop\static_html.zip C:\Users\topcoder\Desktop\pdfFromHTML.pdf"
```