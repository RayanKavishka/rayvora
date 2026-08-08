package lk.ijse.rayvora.service.impl;

import lk.ijse.rayvora.dto.UserDTO;
import lk.ijse.rayvora.entity.Address;
import lk.ijse.rayvora.entity.User;
import lk.ijse.rayvora.exception.RayvoraException;
import lk.ijse.rayvora.repository.AddressRepository;
import lk.ijse.rayvora.repository.UserRepository;
import lk.ijse.rayvora.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;

    @Override
    @Transactional
    public void saveUser(UserDTO userDTO) {
        log.info("Execute saveUser() dto {}", userDTO);
        try {
            User user = new User();
            user.setUserName(userDTO.getUsername());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            user.setUserRoles(userDTO.getUserRoles());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setEmail(userDTO.getEmail());
            user.setContact(userDTO.getContact());

            User savedUser = userRepository.save(user);

            if (userDTO.getUserRoles().equals("SELLER")) {
                Address businessAddress = new Address();
                businessAddress.setFullName(userDTO.getAddress().getFullName());
                businessAddress.setContact(userDTO.getAddress().getContact());
                businessAddress.setStreet(userDTO.getAddress().getStreet());
                businessAddress.setCity(userDTO.getAddress().getCity());
                businessAddress.setDistrict(userDTO.getAddress().getDistrict());
                businessAddress.setProvince(userDTO.getAddress().getProvince());
                businessAddress.setZipCode(userDTO.getAddress().getZipCode());
                businessAddress.setCountry(userDTO.getAddress().getCountry());

                businessAddress.setUser(savedUser);

                addressRepository.save(businessAddress);
            }

        } catch (Exception e) {
            log.error("Error in saveUser() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public UserDTO getUserDetails(String username, String password) {
        log.info("Execute getUserDetails() username {}, password {}", username, password);
        try {
            Optional<User> optionalUser = userRepository.findByUserName(username);
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related user is not found!");

            User user = optionalUser.get();
            if (!passwordEncoder.matches(password, user.getPassword()) && password.isBlank()) {
                throw new RayvoraException(401, "Invalid username or password");
            }

            return new UserDTO(
                    user.getUserId(),
                    user.getUserName(),
                    user.getPassword(),
                    user.getUserRoles()
            );

        } catch (Exception e) {
            log.error("Error in getUserDetails() : " + e.getMessage());
            throw e;
        }
    }
}
