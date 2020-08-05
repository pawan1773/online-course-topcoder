package com.topcoder.course.online.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.adobe.platform.operation.ExecutionContext;
import com.adobe.platform.operation.auth.Credentials;
import com.adobe.platform.operation.exception.SdkException;
import com.adobe.platform.operation.exception.ServiceApiException;
import com.adobe.platform.operation.exception.ServiceUsageException;
import com.adobe.platform.operation.io.FileRef;
import com.adobe.platform.operation.pdfops.CreatePDFOperation;
import com.adobe.platform.operation.pdfops.options.createpdf.CreatePDFOptions;
import com.adobe.platform.operation.pdfops.options.createpdf.PageLayout;
import com.topcoder.course.online.model.request.GeneratePdfRequestModel;
import com.topcoder.course.online.service.GeneratePdfService;

@Service
public class GeneratePdfServiceImpl implements GeneratePdfService {

	/**
	 * <p>
	 * To generate PDF.
	 * </p>
	 * 
	 * @param model
	 * @return {@linkplain Map}
	 */
	@Override
	public Map<String, Object> generatePdf(final GeneratePdfRequestModel model) {
		final Map<String, Object> map = new HashMap<>(4);
		try {
			final String htmlContent = "<img src = \"" + model.getEncodedImage() + "\" />";
			final String rootPath = "src/main/resources";
			final String pathWithUserFolder = rootPath + "/static/" + model.getUser() + "/";

			final String folderName = pathWithUserFolder + generateRandomFolderName();

			final String zipDirectory = folderName + "/zip/";
			final String pdfDirectory = folderName + "/pdf/";

			final Path zipPath = Paths.get(zipDirectory);
			final Path pdfPath = Paths.get(pdfDirectory);

			Files.createDirectories(zipPath);
			Files.createDirectories(pdfPath);

			final StringBuilder builder = new StringBuilder();
			builder.append(htmlContent);

			final File file = new File(zipDirectory + "archived_html.zip");
			final ZipOutputStream out = new ZipOutputStream(new FileOutputStream(file));
			final ZipEntry e = new ZipEntry("index.html");
			out.putNextEntry(e);

			byte[] data = builder.toString().getBytes();
			out.write(data, 0, data.length);
			out.closeEntry();
			out.close();

			final Credentials credentials = Credentials.serviceAccountCredentialsBuilder()
					.fromFile(rootPath + "/pdftools-api-credentials.json").build();
			final ExecutionContext executionContext = ExecutionContext.create(credentials);
			final CreatePDFOperation createPDFOperation = CreatePDFOperation.createNew();
			final FileRef inputHtmlZipRef = FileRef.createFromLocalFile(zipDirectory + "archived_html.zip");
			createPDFOperation.setInput(inputHtmlZipRef);

			setCustomOptions(createPDFOperation);

			final FileRef outputPdfRef = createPDFOperation.execute(executionContext);
			outputPdfRef.saveAs(pdfDirectory + "notes.pdf");

			final File pdfFile = new File(pdfDirectory + "notes.pdf");
			final FileInputStream pdfFis = new FileInputStream(pdfFile);
			byte fileData[] = new byte[(int) pdfFile.length()];
			pdfFis.read(fileData);
			final String encodedFile = Base64.getEncoder().encodeToString(fileData);
	
			map.put("status", HttpStatus.OK.value());
			map.put("statusMessage", HttpStatus.OK.name());
			map.put("success", "Downloading started.");
			map.put("encodedFile", encodedFile);

			pdfFis.close();
			return map;
		} catch (final ServiceApiException | IOException | SdkException | ServiceUsageException ex) {
			map.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
			map.put("statusMessage", HttpStatus.INTERNAL_SERVER_ERROR.name());
			map.put("error", "Download error. Please try again.");

		} catch (final Exception ex) {
			map.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
			map.put("statusMessage", HttpStatus.INTERNAL_SERVER_ERROR.name());
			map.put("error", "Download error. Please try again.");

		}
		return map;
	}

	/**
	 * <p>
	 * To set custom options for Pdf.
	 * </p>
	 * 
	 * @param createPDFOperation
	 */
	private void setCustomOptions(final CreatePDFOperation createPDFOperation) {
		final PageLayout pageLayout = new PageLayout();
		pageLayout.setPageSize(8, 11.5);

		final CreatePDFOptions createPDFOptions = CreatePDFOptions.htmlOptionsBuilder().includeHeaderFooter(false)
				.withPageLayout(pageLayout).build();
		createPDFOperation.setOptions(createPDFOptions);
	}

	/**
	 * <p>
	 * To generate random folder name.
	 * </p>
	 * 
	 * @return {@linkplain String}
	 */
	private String generateRandomFolderName() {
		int leftLimit = 48;
		int rightLimit = 122;
		int targetStringLength = 20;
		final Random random = new Random();

		String generatedString = random.ints(leftLimit, rightLimit + 1)
				.filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97)).limit(targetStringLength)
				.collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();
		return generatedString;
	}
}
