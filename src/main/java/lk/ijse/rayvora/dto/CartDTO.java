package lk.ijse.rayvora.dto;

import jakarta.validation.constraints.NotNull;
import lk.ijse.rayvora.enumeration.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {
    private Long cartId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Status status;

    @NotNull(message = "User is required")
    private Long userId;
}