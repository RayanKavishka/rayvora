package lk.ijse.rayvora.dto;

import lk.ijse.rayvora.enumeration.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Integer userId;
    private String username;
    private String password;
    private String userRoles;
    private String firstName;
    private String lastName;
    private String email;
    private String contact;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Status status;
}
