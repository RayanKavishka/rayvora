package lk.ijse.rayvora.service;

import lk.ijse.rayvora.dto.UserDTO;
import lk.ijse.rayvora.dto.request.ChangePasswordDTO;
import lk.ijse.rayvora.dto.request.UpdateUserDTO;

import java.util.List;

public interface UserService {
    void saveUser(UserDTO userDTO);
    UserDTO getUserDetails(String username, String password);
    void updateUser(UpdateUserDTO updateUserDTO);
    void updateActiveStatus(Long userId);
    UserDTO getUserById(Long userId);
    List<UserDTO> getAllUsers(String role);
    void changePassword(ChangePasswordDTO changePasswordDTO);
}
