package lk.ijse.rayvora.service;

public interface EmailService {
    void sendEmail(String receiverName, String receiverEmail, String subject, String htmlContent);
}
