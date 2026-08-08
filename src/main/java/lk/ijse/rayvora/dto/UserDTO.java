package lk.ijse.rayvora.dto;

import lk.ijse.rayvora.entity.Address;
import lk.ijse.rayvora.enumeration.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long userId;

    @NotBlank(message = "Username is required")
    @Size(min = 5, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 150, message = "Password must be between 8 and 255 characters")
    private String password;

    @NotBlank(message = "User role is required")
    private String userRoles;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Contact is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Contact must contain exactly 10 digits"
    )
    private String contact;

    private LocalDateTime createdAt;
    private Status status;

    private Address address;

    public UserDTO(Long userId, String username, String password, String userRoles) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.userRoles = userRoles;
    }
}
