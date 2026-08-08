package lk.ijse.rayvora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lk.ijse.rayvora.enumeration.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private Long addressId;

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @NotBlank(message = "Contact is required")
    @Pattern(
            regexp = "[0-9]{10}$",
            message = "Contact must contain exactly 10 digits"
    )
    private String contact;

    @NotBlank(message = "Street is required")
    @Size(max = 250, message = "Street must not exceed 250 characters")
    private String street;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @NotBlank(message = "District is required")
    @Size(max = 100, message = "District must not exceed 100 characters")
    private String district;

    @NotBlank(message = "Province is required")
    @Size(max = 100, message = "Province must not exceed 100 characters")
    private String province;

    @NotNull(message = "Zip code is required")
    private Integer zipCode;

    @NotBlank(message = "Country is required")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    private Status status = Status.ACTIVE;


}