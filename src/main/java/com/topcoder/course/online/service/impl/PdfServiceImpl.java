package com.topcoder.course.online.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.adobe.platform.operation.ExecutionContext;
import com.adobe.platform.operation.auth.Credentials;
import com.adobe.platform.operation.exception.SdkException;
import com.adobe.platform.operation.exception.ServiceApiException;
import com.adobe.platform.operation.exception.ServiceUsageException;
import com.adobe.platform.operation.io.FileRef;
import com.adobe.platform.operation.pdfops.CreatePDFOperation;
import com.adobe.platform.operation.pdfops.options.createpdf.CreatePDFOptions;
import com.adobe.platform.operation.pdfops.options.createpdf.PageLayout;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.topcoder.course.online.entity.CourseFile;
import com.topcoder.course.online.entity.PdfAnnotation;
import com.topcoder.course.online.model.request.GeneratePdfRequestModel;
import com.topcoder.course.online.repository.CourseFileRepository;
import com.topcoder.course.online.repository.PdfAnnotationRepository;
import com.topcoder.course.online.service.PdfService;

/**
 * <p>
 * This is implementation class for {@link PdfService}. This class contains
 * business logic for pdf relation operations.
 * <p>
 * 
 * @author joginder.pawan@gmail.com
 * 
 */
@Service
public class PdfServiceImpl implements PdfService {

	@Autowired
	private CourseFileRepository courseFileRepository;

	@Autowired
	private PdfAnnotationRepository pdfAnnotationRepository;

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
			final String randomDirectory = UUID.randomUUID().toString();
			final String folderName = pathWithUserFolder + randomDirectory;

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
	 * To upload file.
	 * </p>
	 * 
	 * @param fileLinkName
	 * @param courseCategory
	 * @param uploadfile
	 * @return {@linkplain Map}
	 */
	@Override
	public Map<String, Object> uploadPdf(final String fileLinkName, final String courseCategory,
			final MultipartFile uploadfile) {
		final Map<String, Object> map = new HashMap<>(3);
		try {
			final CourseFile courseFile = new CourseFile();
			courseFile.setId(UUID.randomUUID().toString());
			courseFile.setContent(uploadfile.getBytes());
			courseFile.setFileName(uploadfile.getOriginalFilename());
			courseFile.setCourseCategory(courseCategory);
			courseFile.setFileLinkName(fileLinkName);

			this.courseFileRepository.save(courseFile);

			map.put("status", HttpStatus.OK.value());
			map.put("statusMessage", HttpStatus.OK.name());
			map.put("success", "File uploaded.");
			return map;
		} catch (Exception e) {
			map.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
			map.put("statusMessage", HttpStatus.INTERNAL_SERVER_ERROR.name());
			map.put("error", "Upload error. Please try again.");
			e.printStackTrace();
			return map;
		}
	}

	/**
	 * <p>
	 * Returns list of files for course category.
	 * </p>
	 * 
	 * @param courseCategory
	 * @return {@link List} of {@link CourseFile}
	 */
	@Override
	public List<CourseFile> findByCourseCategory(String courseCategory) {
		return this.courseFileRepository.findByCourseCategory(courseCategory);
	}

	/**
	 * <p>
	 * To get {@link CourseFile} by id.
	 * </p>
	 * 
	 * @param id
	 * @return instance of {@link CourseFile}
	 */
	@Override
	public CourseFile findByFileId(final String id) {
		return this.courseFileRepository.findById(id).get();
	}

	/**
	 * <p>
	 * To save annotation
	 * </p>
	 * 
	 * @param map
	 */
	@Override
	public void saveAnnotation(Map<String, Object> map) {
		final String annotationId = map.get("annotationId").toString();

		boolean isPresent = this.pdfAnnotationRepository.existsByAnnotationIdAndAnnotationContaining(annotationId,
				map.get("createDate").toString());

		if (!isPresent) {
			boolean isConflict = this.pdfAnnotationRepository.existsByAnnotationId(annotationId);
			final PdfAnnotation pdfAnnotation = new PdfAnnotation();
			pdfAnnotation.setFileId(map.get("fileId").toString());

			ObjectMapper objectMapper = new ObjectMapper();
			try {
				String jsonString = objectMapper.writeValueAsString(map.get("annotation"));
				if (isConflict) {
					final String newAnnotationId = UUID.randomUUID().toString();
					jsonString = jsonString.replace(annotationId, newAnnotationId);
					pdfAnnotation.setAnnotationId(newAnnotationId);
				} else {
					pdfAnnotation.setAnnotationId(annotationId);
				}
				pdfAnnotation.setAnnotation(jsonString);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
			this.pdfAnnotationRepository.save(pdfAnnotation);
		}
	}

	/**
	 * <p>
	 * To get annotations by file id.
	 * </p>
	 * 
	 * @param fileId
	 * @return {@linkplain List} of {@linkplain Map}
	 */
	@Override
	public List<HashMap<String, Object>> getAnnotationsByFileId(String fileId) {
		final List<String> annotations = this.pdfAnnotationRepository.findByFileId(fileId);
		final ObjectMapper objectMapper = new ObjectMapper();
		final List<HashMap<String, Object>> list = new ArrayList<>();
		annotations.forEach(annotation -> {
			try {
				HashMap<String, Object> readValue = objectMapper.readValue(annotation,
						new TypeReference<HashMap<String, Object>>() {
						});
				list.add(readValue);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
		});
		return list;
	}

	/**
	 * <p>
	 * To delete annotation by annotation id.
	 * </p>
	 * 
	 * @param annotationId
	 */
	@Transactional
	@Override
	public void deleteAnnotation(final String annotationId) {
		this.pdfAnnotationRepository.deleteByAnnotationId(annotationId);
	}

	/**
	 * <p>
	 * To update annotation.
	 * </p>
	 * 
	 * @param model
	 */
	@Transactional
	@Modifying
	@Override
	public void updateAnnotation(final Map<String, Object> model) {
		final String annotationId = model.get("annotationId").toString();
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			final Optional<PdfAnnotation> oPdfAnnotation = this.pdfAnnotationRepository
					.findByAnnotationId(annotationId);
			if (oPdfAnnotation.isPresent()) {
				final PdfAnnotation pdfAnnotation = oPdfAnnotation.get();
				final String jsonString = objectMapper.writeValueAsString(model.get("annotation"));
				pdfAnnotation.setAnnotation(jsonString);
				this.pdfAnnotationRepository.save(pdfAnnotation);
			}
		} catch (final JsonProcessingException e) {
			e.printStackTrace();
		}
	}
}
