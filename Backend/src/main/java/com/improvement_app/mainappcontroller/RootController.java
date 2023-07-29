package com.improvement_app.mainappcontroller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class RootController {

    @GetMapping
    public String redirectToSwagger(){
        return "redirect:/swagger-ui/index.html";
    }

}
