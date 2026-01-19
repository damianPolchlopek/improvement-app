package com.improvement_app.common.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/audit")
public class DietAuditController {

    private final DietAuditService dietAuditService;

    @GetMapping("/revision/{id}")
    public List<Number> getRevisions(@PathVariable Long id) {
        return dietAuditService.getRevisions(id);
    }

}
