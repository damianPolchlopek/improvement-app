package com.improvement_app.security.command.request;

import lombok.Data;

@Data
public class ResendVerificationEmailRequest {
    private String email;
}
