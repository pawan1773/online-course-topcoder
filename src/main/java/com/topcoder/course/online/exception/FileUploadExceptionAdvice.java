package com.topcoder.course.online.exception;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

/**
 * <p>
 * To handle exception in case file exceeds 2MB.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 * 
 */
@RestControllerAdvice
public class FileUploadExceptionAdvice {

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<Map<String, String>> handleMaxSizeException(MaxUploadSizeExceededException musee,
			HttpServletRequest request, HttpServletResponse response) {
		final Map<String, String> map = new HashMap<>();
		map.put("error", "Maximum allowed file size is 2MB.");
		return ResponseEntity.badRequest().body(map);
	}
}