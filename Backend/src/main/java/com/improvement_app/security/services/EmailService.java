package com.improvement_app.security.services;

import com.improvement_app.security.entity.UserTokenEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String email, UserTokenEntity token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Potwierdź swój adres email");
            helper.setFrom(fromEmail);

            String verificationLink = frontendUrl + "/verify-email?token=" + token.getToken();

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .button { 
                            display: inline-block; 
                            background-color: #007bff; 
                            color: white; 
                            padding: 12px 24px; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            margin: 20px 0;
                        }
                        .footer { margin-top: 30px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Witaj w naszej aplikacji!</h2>
                        <p>Dziękujemy za rejestrację. Aby aktywować swoje konto, kliknij poniższy przycisk:</p>
                        
                        <a href="%s" class="button">Potwierdź email</a>
                        
                        <p>Lub skopiuj i wklej poniższy link do przeglądarki:</p>
                        <p><a href="%s">%s</a></p>
                        
                        <p><strong>Ważne:</strong> Link jest ważny przez 24 godziny.</p>
                        
                        <div class="footer">
                            <p>Jeśli nie rejestrowałeś się w naszej aplikacji, zignoruj ten email.</p>
                            <p>To jest automatyczna wiadomość, nie odpowiadaj na nią.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(verificationLink, verificationLink, verificationLink);

            helper.setText(htmlContent, true);
            mailSender.send(message);

            log.info("Verification email sent successfully to: {}", email);

        } catch (MessagingException e) {
            log.error("Failed to send verification email to: {}", email, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
}