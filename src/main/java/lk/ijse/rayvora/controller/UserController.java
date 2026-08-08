package lk.ijse.rayvora.controller;

import jakarta.validation.Valid;
import lk.ijse.rayvora.constant.CommonResponse;
import lk.ijse.rayvora.constant.ResponseCode;
import lk.ijse.rayvora.constant.ResponseMessage;
import lk.ijse.rayvora.dto.UserDTO;
import lk.ijse.rayvora.dto.request.AuthDTO;
import lk.ijse.rayvora.dto.response.UserDataDTO;
import lk.ijse.rayvora.security.JwtUtil;
import lk.ijse.rayvora.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping(value = "/signup", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse signUpUser(@Valid @RequestBody UserDTO userDTO) {
        userService.saveUser(userDTO);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @PostMapping(value = "/signin", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse signInUser(@Valid @RequestBody AuthDTO authDTO) {
        UserDTO userDetails = userService.getUserDetails(authDTO.getUsername(), authDTO.getPassword());
        String token = jwtUtil.generateToken(userDetails);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                new UserDataDTO(userDetails.getUserId(), token),
                ResponseMessage.JWT_TOKEN
        );
    }
}
