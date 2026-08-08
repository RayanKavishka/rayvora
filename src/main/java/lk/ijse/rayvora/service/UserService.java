package lk.ijse.rayvora.service;

import lk.ijse.rayvora.dto.UserDTO;

public interface UserService {
    void saveUser(UserDTO userDTO);
    UserDTO getUserDetails(String username, String password);
}
