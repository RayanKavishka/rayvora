package lk.ijse.rayvora.service;

import lk.ijse.rayvora.dto.UserDTO;
import java.util.List;

public interface UserService {
    void saveUser(UserDTO userDTO);
    UserDTO getUserDetails(String username, String password);
    void updateUser(UserDTO userDTO);
    void updateActiveStatus(Long userId);
    UserDTO getUserById(Long userId);
    List<UserDTO> getAllUsers();
}
