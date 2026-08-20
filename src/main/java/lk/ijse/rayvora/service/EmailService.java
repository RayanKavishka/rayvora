package lk.ijse.rayvora.service;

import lk.ijse.rayvora.entity.Orders;

public interface EmailService {
    void sendEmail(Orders order, String receiverName, String receiverEmail, String subject, String htmlContent);
}
