package lk.ijse.rayvora.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RayvoraException extends RuntimeException {
    private Integer status;
    private String message;
}
