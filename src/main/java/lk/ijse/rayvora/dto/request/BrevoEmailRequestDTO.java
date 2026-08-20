package lk.ijse.rayvora.dto.request;

import lk.ijse.rayvora.dto.ReceiverDTO;
import lk.ijse.rayvora.dto.SenderDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrevoEmailRequestDTO {
    private SenderDTO sender;
    private List<ReceiverDTO> to;
    private String subject;
    private String htmlContent;
}
