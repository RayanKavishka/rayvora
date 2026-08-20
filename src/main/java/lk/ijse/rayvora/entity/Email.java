package lk.ijse.rayvora.entity;

import jakarta.persistence.*;
import lk.ijse.rayvora.enumeration.EmailStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Email {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long emailId;
    private String receiverName;
    private String receiverEmail;
    private String subject;

    @Enumerated(EnumType.STRING)
    private EmailStatus emailStatus;

    @CreationTimestamp
    private LocalDateTime sentAt;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Orders order;
}