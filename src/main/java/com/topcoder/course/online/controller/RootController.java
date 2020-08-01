package com.topcoder.course.online.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * <p>
 * Root controller to handle landing page request.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 *
 */
@Controller
public class RootController {

	/**
	 * <p>
	 * To return index view name.
	 * </p>
	 * 
	 * @return index
	 */
	@GetMapping("/")
	public String viewIndexPage() {
		return "index";
	}
}
