package lk.ijse.rayvora.util;

import lk.ijse.rayvora.entity.OrderProducts;
import lk.ijse.rayvora.entity.Orders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class OrderEmailBuilder {

//    @Value("${app.frontend-base-url:http://localhost:5173}")
//    private String frontendBaseUrl;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("MMM dd, yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("h:mm a");

    // ---------- ORDER CONFIRMED ----------
    public String buildConfirmed(Orders order) {
        return loadTemplate("order-confirmed.html")
                .replace("{{orderNumber}}", String.valueOf(order.getOrderId()))
                .replace("{{orderDate}}", order.getOrderDate().format(DATE_FORMAT))
                .replace("{{estimatedDeliveryDate}}", order.getEstimatedDeliveryTo().format(DATE_FORMAT))
                .replace("{{orderItems}}", buildItemRows(order.getOrderProducts(), true))
                .replace("{{subtotal}}", currency(order.getTotalAmount()))
                .replace("{{deliveryFee}}", currency(new BigDecimal(0)))
                .replace("{{total}}", currency(order.getTotalAmount()))
                .replace("{{customerName}}", customerName(order))
                .replace("{{addressLine}}", order.getUser().getAddress().getStreet())
                .replace("{{city}}", order.getUser().getAddress().getCity())
                .replace("{{postalCode}}", String.valueOf(order.getUser().getAddress().getZipCode()))
                .replace("{{country}}", order.getUser().getAddress().getCountry())
                .replace("{{trackingUrl}}", orderUrl(order.getOrderId()));
    }

    // ---------- ORDER SHIPPED ----------
    public String buildShipped(Orders order, String carrierName, String trackingNumber) {
        return loadTemplate("order-shipped.html")
                .replace("{{orderNumber}}", String.valueOf(order.getOrderId()))
                .replace("{{carrierName}}", carrierName)
                .replace("{{trackingNumber}}", trackingNumber)
                .replace("{{shippedDate}}", java.time.LocalDate.now().format(DATE_FORMAT))
                .replace("{{estimatedDeliveryDate}}", order.getEstimatedDeliveryTo().format(DATE_FORMAT))
                .replace("{{shippingItems}}", buildItemRows(order.getOrderProducts(), false))
                .replace("{{customerName}}", customerName(order))
                .replace("{{addressLine}}", order.getUser().getAddress().getStreet())
                .replace("{{city}}", order.getUser().getAddress().getCity())
                .replace("{{postalCode}}", String.valueOf(order.getUser().getAddress().getZipCode()))
                .replace("{{country}}", order.getUser().getAddress().getCountry())
                .replace("{{trackingUrl}}", orderUrl(order.getOrderId()));
    }


    // ---------- ORDER DELIVERED ----------
    public String buildDelivered(Orders order) {
        var now = java.time.LocalDateTime.now();

        return loadTemplate("order-delivered.html")
                .replace("{{orderNumber}}", String.valueOf(order.getOrderId()))
                .replace("{{deliveredDate}}", now.format(DATE_FORMAT))
                .replace("{{deliveredTime}}", now.format(TIME_FORMAT))
                .replace("{{orderItems}}", buildItemRows(order.getOrderProducts(), false))
                .replace("{{customerName}}", customerName(order))
                .replace("{{addressLine}}", order.getUser().getAddress().getStreet())
                .replace("{{city}}", order.getUser().getAddress().getCity())
                .replace("{{postalCode}}", String.valueOf(order.getUser().getAddress().getZipCode()))
                .replace("{{country}}", order.getUser().getAddress().getCountry())
                .replace("{{reviewUrl}}", reviewUrl(order.getOrderId()));
    }


    // ---------- ORDER CANCELLED ----------
    public String buildCancelled(Orders order, String cancellationReason, BigDecimal refundAmount) {
        return loadTemplate("order-cancelled.html")
                .replace("{{orderNumber}}", String.valueOf(order.getOrderId()))
                .replace("{{cancelledDate}}", java.time.LocalDate.now().format(DATE_FORMAT))
                .replace("{{cancellationReason}}", cancellationReason)
                .replace("{{cancelledItems}}", buildItemRows(order.getOrderProducts(), false))
                .replace("{{refundAmount}}", currency(refundAmount));
    }


    // ---------- ORDER REFUNDED ----------
    public String buildRefunded(
            Orders order,
            BigDecimal refundAmount,
            String refundMethod,
            String refundReference,
            String estimatedRefundDays
    ) {
        return loadTemplate("order-refunded.html")
                .replace("{{orderNumber}}", String.valueOf(order.getOrderId()))
                .replace("{{refundAmount}}", currency(refundAmount))
                .replace("{{refundDate}}", java.time.LocalDate.now().format(DATE_FORMAT))
                .replace("{{refundMethod}}", refundMethod)
                .replace("{{refundReference}}", refundReference)
                .replace("{{estimatedRefundDays}}", estimatedRefundDays)
                .replace("{{orderItems}}", buildItemRows(order.getOrderProducts(), false))
                .replace("{{trackingUrl}}", orderUrl(order.getOrderId()));
    }

    // ---------- helpers ----------
    private String loadTemplate(String fileName) {
        try (InputStream is = getClass().getResourceAsStream("/templates/" + fileName)) {
            if (is == null) throw new IOException("Template not found: /templates/" + fileName);
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load email template: " + fileName, e);
        }
    }

    private String buildItemRows(List<OrderProducts> items, boolean withPrice) {
        StringBuilder sb = new StringBuilder();
        for (OrderProducts item : items) {
            sb.append("<tr>")
              .append("<td class=\"item-name\">").append(item.getProduct().getProductName()).append("</td>")
              .append("<td align=\"center\"><span class=\"qty-pill\">").append(item.getQuantity()).append("</span></td>");
            if (withPrice) {
                sb.append("<td align=\"right\">").append(currency(item.getProduct().getUnitPrice())).append("</td>");
            }
            sb.append("</tr>");
        }
        return sb.toString();
    }

    private String customerName(Orders order) {
        return order.getUser().getFirstName() + " " + order.getUser().getLastName();
    }

    private String currency(BigDecimal amount) {
        return "Rs. " + String.format("%,.2f", amount);
    }

    private String orderUrl(Long orderId) {
//        return frontendBaseUrl + "/#/orders/track/" + orderId;
        return "/#/orders/track/" + orderId;
    }

    private String reviewUrl(Long orderId) {
//        return frontendBaseUrl + "/#/orders/" + orderId + "/review";
        return "/#/orders/" + orderId + "/review";
    }
}