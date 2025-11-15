package com.improvement_app.security.exceptions;

public class TokenAlreadyUsedException extends RuntimeException {
    public TokenAlreadyUsedException(String s) {
        super(s);
    }
}
