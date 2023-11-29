package com.improvement_app.util;

import java.util.List;

public record ListResponse<T>(List<T> content) {
    public static <T> ListResponse<T> of(List<T> list) {return new ListResponse<>(list);}
}
