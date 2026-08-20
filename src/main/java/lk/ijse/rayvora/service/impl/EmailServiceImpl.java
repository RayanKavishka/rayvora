package lk.ijse.rayvora.service.impl;

import lk.ijse.rayvora.dto.ReceiverDTO;
import lk.ijse.rayvora.dto.SenderDTO;
import lk.ijse.rayvora.dto.request.BrevoEmailRequestDTO;
import lk.ijse.rayvora.entity.Email;
import lk.ijse.rayvora.enumeration.EmailStatus;
import lk.ijse.rayvora.repository.EmailRepository;
import lk.ijse.rayvora.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
    private final RestClient brevoRestClient;
    private final EmailRepository emailRepository;

    @Value("${brevo.api-key}")
    private String apiKey;

    @Value("${brevo.sender-email}")
    private String senderEmail;

    @Value("${brevo.sender-name}")
    private String senderName;

    @Override
    public void sendEmail(String receiverName, String receiverEmail, String subject, String htmlContent) {
        log.info("Execute sendEmail() receiverEmail {}, receiverName {}", receiverEmail, receiverName);

        Email email = new Email();
        try {
            email.setReceiverName(receiverName);
            email.setReceiverEmail(receiverEmail);
            email.setSubject(subject);
            email.setEmailStatus(EmailStatus.PENDING);

            email = emailRepository.save(email);

            BrevoEmailRequestDTO emailRequestDTO = new BrevoEmailRequestDTO();
            emailRequestDTO.setSender(new SenderDTO(
                    senderName, senderEmail
            ));

            emailRequestDTO.setTo(List.of(
                    new ReceiverDTO(receiverName, receiverEmail)
            ));

            emailRequestDTO.setSubject(subject);
            emailRequestDTO.setHtmlContent(htmlContent);


            brevoRestClient
                    .post()
                    .uri("/v3/smtp/email")
                    .header("api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(emailRequestDTO)
                    .retrieve()
                    .toBodilessEntity();

            email.setEmailStatus(EmailStatus.SENT);
            email = emailRepository.save(email);

        } catch (Exception e) {
            email.setEmailStatus(EmailStatus.FAILED);
            emailRepository.save(email);

            log.error("Error in sendEmail() : " + e.getMessage());
            throw e;
        }
    }
}
