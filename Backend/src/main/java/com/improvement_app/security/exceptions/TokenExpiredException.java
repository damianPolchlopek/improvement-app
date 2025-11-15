package com.improvement_app.security.exceptions;

public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException(String s) {
        super(s);
    }
}
