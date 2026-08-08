package lk.ijse.rayvora.exception;

import lk.ijse.rayvora.constant.CommonResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class AppExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<CommonResponse> handleServerException(Exception e, WebRequest webRequest) {
        e.printStackTrace();
        return ResponseEntity.ok(new CommonResponse(
                500,
                "UNEXPECTED_ERROR"
        ));
    }

    @ExceptionHandler(value = {RayvoraException.class})
    public ResponseEntity<CommonResponse> handleRayvoraException(RayvoraException e, WebRequest webRequest) {
        e.printStackTrace();
        return ResponseEntity.ok(new CommonResponse(
                e.getStatus(),
                e.getMessage()
        ));
    }
}
