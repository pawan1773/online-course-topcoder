package com.topcoder.course.online.entity;

import java.io.Serializable;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

/**
 * <p>
 * This class represents user_details table.
 * <p>
 * 
 * @author joginder.pawan@gmail.com
 * 
 */
@Entity
@Table(name = "course_file_details")
public class CourseFile implements Serializable {

	private static final long serialVersionUID = 4416862687798494418L;

	@Id
	@Column(name = "id")
	private String id;

	@Lob
	@Basic(fetch = FetchType.EAGER)
	@Column(name = "content", length = 16000000)
	private byte[] content;

	@Column(name = "file_name", length = 50)
	private String fileName;

	@Column(name = "course_category", length = 30)
	private String courseCategory;

	@Column(name = "file_link_name", length = 30)
	private String fileLinkName;

	public CourseFile(String id, String fileLinkName) {
		super();
		this.id = id;
		this.fileLinkName = fileLinkName;
	}

	public CourseFile() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getCourseCategory() {
		return courseCategory;
	}

	public void setCourseCategory(String courseCategory) {
		this.courseCategory = courseCategory;
	}

	public String getFileLinkName() {
		return fileLinkName;
	}

	public void setFileLinkName(String fileLinkName) {
		this.fileLinkName = fileLinkName;
	}

	public byte[] getContent() {
		return content;
	}

	public void setContent(byte[] content) {
		this.content = content;
	}
}