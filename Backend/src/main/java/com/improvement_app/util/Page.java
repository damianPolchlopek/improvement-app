package com.improvement_app.util;

import java.util.List;

public record Page<T>(List<T> content, int pageNumber, int totalPages, int totalElements) {
    @Override
    public String toString() {
        return "Page " + pageNumber + " of " + totalPages + ": " + content + " total elements: " + totalElements;
    }
}
