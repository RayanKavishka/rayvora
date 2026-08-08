package lk.ijse.rayvora.constant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonResponse {
    private Integer status;
    private Object body;
    private String message;

    public CommonResponse(Integer status, String message) {
        this.status = status;
        this.message = message;
    }
}
