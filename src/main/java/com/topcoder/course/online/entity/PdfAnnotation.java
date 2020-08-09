package com.topcoder.course.online.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * <p>
 * This class represents pdf_annotation table.
 * <p>
 * 
 * @author joginder.pawan@gmail.com
 */
@Entity
@Table(name = "pdf_annotation")
public class PdfAnnotation implements Serializable {

	private static final long serialVersionUID = 5606470240615812778L;

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "source_id", nullable = false)
	private String sourceId;
	
	@Column(name = "file_id", nullable = false)
	private String fileId;

	@Column(name = "annotation_ob", columnDefinition = "TEXT", nullable = false)
	private String annotation;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAnnotation() {
		return annotation;
	}

	public void setAnnotation(String annotation) {
		this.annotation = annotation;
	}

	public String getSourceId() {
		return sourceId;
	}

	public void setSourceId(String sourceId) {
		this.sourceId = sourceId;
	}

	public String getFileId() {
		return fileId;
	}

	public void setFileId(String fileId) {
		this.fileId = fileId;
	}
	
	
}
