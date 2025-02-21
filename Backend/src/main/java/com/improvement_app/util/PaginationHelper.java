package com.improvement_app.util;

import java.util.ArrayList;
import java.util.List;

public class PaginationHelper {

    private PaginationHelper() {
        throw new IllegalStateException("Utility class");
    }

    public static <T> Page<T> getPage(List<T> list, int pageNumber, int pageSize) {
        if (pageNumber < 1 || pageSize < 1) {
            throw new IllegalArgumentException("Page number and page size must be greater than 0");
        }

        int totalPages = (int) Math.ceil((double) list.size() / pageSize);
        if (pageNumber > totalPages) {
            return new Page<>(new ArrayList<>(), pageNumber, totalPages, list.size());
        }

        int fromIndex = (pageNumber - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, list.size());

        return new Page<>(list.subList(fromIndex, toIndex), pageNumber, totalPages, list.size());
    }
}
