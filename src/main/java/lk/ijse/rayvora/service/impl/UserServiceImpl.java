package lk.ijse.rayvora.service.impl;

import lk.ijse.rayvora.dto.AddressDTO;
import lk.ijse.rayvora.dto.UserDTO;
import lk.ijse.rayvora.dto.request.ChangePasswordDTO;
import lk.ijse.rayvora.dto.request.UpdateUserDTO;
import lk.ijse.rayvora.entity.Address;
import lk.ijse.rayvora.entity.User;
import lk.ijse.rayvora.enumeration.Status;
import lk.ijse.rayvora.exception.RayvoraException;
import lk.ijse.rayvora.repository.AddressRepository;
import lk.ijse.rayvora.repository.UserRepository;
import lk.ijse.rayvora.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;

    @Override
    public UserDTO getUserDetails(String username, String password) {
        log.info("Execute getUserDetails() username {}, password {}", username, password);
        try {
            Optional<User> optionalUser = userRepository.findByUserName(username);
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Invalid username or password");

            User user = optionalUser.get();
            if (!passwordEncoder.matches(password, user.getPassword()) || password.isBlank()) {
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

    @Override
    @Transactional
    public void saveUser(UserDTO userDTO) {
        log.info("Execute saveUser() dto {}", userDTO);
        try {
            if (userRepository.existsByUserName(userDTO.getUsername())) {
                throw new RayvoraException(409, "Username already exists");
            }
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                throw new RayvoraException(409, "Email already exists");
            }
            if (userRepository.existsByContact(userDTO.getContact())) {
                throw new RayvoraException(409, "Contact already exists");
            }

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
                if (addressRepository.existsByContact(userDTO.getAddressDTO().getContact())) {
                    throw new RayvoraException(409, "Contact already exists in other business");
                }

                Address businessAddress = new Address();
                businessAddress.setFullName(userDTO.getAddressDTO().getFullName());
                businessAddress.setContact(userDTO.getAddressDTO().getContact());
                businessAddress.setStreet(userDTO.getAddressDTO().getStreet());
                businessAddress.setCity(userDTO.getAddressDTO().getCity());
                businessAddress.setDistrict(userDTO.getAddressDTO().getDistrict());
                businessAddress.setProvince(userDTO.getAddressDTO().getProvince());
                businessAddress.setZipCode(userDTO.getAddressDTO().getZipCode());
                businessAddress.setCountry(userDTO.getAddressDTO().getCountry());

                businessAddress.setUser(savedUser);

                addressRepository.save(businessAddress);
            }

        } catch (Exception e) {
            log.error("Error in saveUser() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void updateUser(UpdateUserDTO updateUserDTO) {
        log.info("Execute updateUser() dto {}", updateUserDTO);
        try {
            if (userRepository.existsByUserName(updateUserDTO.getUsername())) {
                throw new RayvoraException(409, "Username already exists");
            }
            if (userRepository.existsByEmail(updateUserDTO.getEmail())) {
                throw new RayvoraException(409, "Email already exists");
            }
            if (userRepository.existsByContact(updateUserDTO.getContact())) {
                throw new RayvoraException(409, "Contact already exists");
            }

            Optional<User> optionalUser = userRepository.findById(updateUserDTO.getUserId());
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related user is not found!");

            User user = optionalUser.get();
            user.setUserName(updateUserDTO.getUsername());
            user.setFirstName(updateUserDTO.getFirstName());
            user.setLastName(updateUserDTO.getLastName());
            user.setEmail(updateUserDTO.getEmail());
            user.setContact(updateUserDTO.getContact());

            User savedUser = userRepository.save(user);

            if (updateUserDTO.getUserRoles().equals("SELLER")) {
                if (addressRepository.existsByContact(updateUserDTO.getAddressDTO().getContact())) {
                    throw new RayvoraException(409, "Contact already exists in other business");
                }

                Optional<Address> optionalAddress = addressRepository.findById(updateUserDTO.getAddressDTO().getAddressId());
                if (optionalAddress.isEmpty())
                    throw new RayvoraException(404, "Sorry, related address is not found!");

                Address businessAddress = optionalAddress.get();
                businessAddress.setFullName(updateUserDTO.getAddressDTO().getFullName());
                businessAddress.setContact(updateUserDTO.getAddressDTO().getContact());
                businessAddress.setStreet(updateUserDTO.getAddressDTO().getStreet());
                businessAddress.setCity(updateUserDTO.getAddressDTO().getCity());
                businessAddress.setDistrict(updateUserDTO.getAddressDTO().getDistrict());
                businessAddress.setProvince(updateUserDTO.getAddressDTO().getProvince());
                businessAddress.setZipCode(updateUserDTO.getAddressDTO().getZipCode());
                businessAddress.setCountry(updateUserDTO.getAddressDTO().getCountry());

                businessAddress.setUser(savedUser);

                addressRepository.save(businessAddress);
            }

        } catch (Exception e) {
            log.error("Error in updateUser() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void updateActiveStatus(Long userId) {
        log.info("Execute updateActiveStatus() id {}", userId);
        try {
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related user is not found!");

            User user = optionalUser.get();
            user.setStatus(Status.INACTIVE);
            userRepository.save(user);

        } catch (Exception e) {
            log.error("Error in updateActiveStatus() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public UserDTO getUserById(Long userId) {
        log.info("Execute getUserById() id {}", userId);
        try {
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related user is not found!");

            AddressDTO addressDTO = new AddressDTO();
            if (optionalUser.get().getAddress() != null) {
                Address address = optionalUser.get().getAddress();
                addressDTO.setAddressId(address.getAddressId());
                addressDTO.setFullName(address.getFullName());
                addressDTO.setContact(address.getContact());
                addressDTO.setStreet(address.getStreet());
                addressDTO.setCity(address.getCity());
                addressDTO.setDistrict(address.getDistrict());
                addressDTO.setProvince(address.getProvince());
                addressDTO.setZipCode(address.getZipCode());
                addressDTO.setCountry(address.getCountry());
                addressDTO.setUserId(address.getUser().getUserId());
            }

            return new UserDTO(
                    optionalUser.get().getUserId(),
                    optionalUser.get().getUserName(),
                    optionalUser.get().getPassword(),
                    optionalUser.get().getUserRoles(),
                    optionalUser.get().getFirstName(),
                    optionalUser.get().getLastName(),
                    optionalUser.get().getEmail(),
                    optionalUser.get().getContact(),
                    optionalUser.get().getCreatedAt(),
                    optionalUser.get().getStatus(),
                    addressDTO
            );

        } catch (Exception e) {
            log.error("Error in getUserById() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public List<UserDTO> getAllUsers(String role) {
        log.info("Execute getAllUsers()");
        try {
            List<User> users = userRepository.findAll();
            List<UserDTO> userDTOList = new ArrayList<>();

            for (User user : users) {
                if (user.getStatus().equals(Status.ACTIVE)) {

                    String mainUserRole = user.getUserRoles().split(", ")[0];
                    if (mainUserRole.equals(role)) {

                        UserDTO userDTO = new UserDTO();

                        userDTO.setUserId(user.getUserId());
                        userDTO.setUsername(user.getUserName());
                        userDTO.setPassword(user.getPassword());
                        userDTO.setUserRoles(user.getUserRoles());
                        userDTO.setFirstName(user.getFirstName());
                        userDTO.setLastName(user.getLastName());
                        userDTO.setEmail(user.getEmail());
                        userDTO.setContact(user.getContact());
                        userDTO.setCreatedAt(user.getCreatedAt());
                        userDTO.setStatus(user.getStatus());

                        if (user.getAddress() != null) {
                            Address address = user.getAddress();

                            AddressDTO addressDTO = new AddressDTO();

                            addressDTO.setAddressId(address.getAddressId());
                            addressDTO.setFullName(address.getFullName());
                            addressDTO.setContact(address.getContact());
                            addressDTO.setStreet(address.getStreet());
                            addressDTO.setCity(address.getCity());
                            addressDTO.setDistrict(address.getDistrict());
                            addressDTO.setProvince(address.getProvince());
                            addressDTO.setZipCode(address.getZipCode());
                            addressDTO.setCountry(address.getCountry());
                            addressDTO.setUserId(user.getUserId());

                            userDTO.setAddressDTO(addressDTO);
                        }

                        userDTOList.add(userDTO);
                    }
                }
            }

            return userDTOList;

        } catch (Exception e) {
            log.error("Error in getAllUsers() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public List<UserDTO> getAllUsersByEmail(String role, String email) {
        log.info("Execute getAllUsersByEmail()");
        try {
            List<User> users = userRepository.findByEmail(email);
            List<UserDTO> userDTOList = new ArrayList<>();

            for (User user : users) {
                if (user.getStatus().equals(Status.ACTIVE)) {

                    String mainUserRole = user.getUserRoles().split(", ")[0];
                    if (mainUserRole.equals(role)) {

                        UserDTO userDTO = new UserDTO();

                        userDTO.setUserId(user.getUserId());
                        userDTO.setUsername(user.getUserName());
                        userDTO.setPassword(user.getPassword());
                        userDTO.setUserRoles(user.getUserRoles());
                        userDTO.setFirstName(user.getFirstName());
                        userDTO.setLastName(user.getLastName());
                        userDTO.setEmail(user.getEmail());
                        userDTO.setContact(user.getContact());
                        userDTO.setCreatedAt(user.getCreatedAt());
                        userDTO.setStatus(user.getStatus());

                        if (user.getAddress() != null) {
                            Address address = user.getAddress();

                            AddressDTO addressDTO = new AddressDTO();

                            addressDTO.setAddressId(address.getAddressId());
                            addressDTO.setFullName(address.getFullName());
                            addressDTO.setContact(address.getContact());
                            addressDTO.setStreet(address.getStreet());
                            addressDTO.setCity(address.getCity());
                            addressDTO.setDistrict(address.getDistrict());
                            addressDTO.setProvince(address.getProvince());
                            addressDTO.setZipCode(address.getZipCode());
                            addressDTO.setCountry(address.getCountry());
                            addressDTO.setUserId(user.getUserId());

                            userDTO.setAddressDTO(addressDTO);
                        }

                        userDTOList.add(userDTO);
                    }
                }
            }

            return userDTOList;

        } catch (Exception e) {
            log.error("Error in getAllUsersByEmail() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void changePassword(ChangePasswordDTO changePasswordDTO) {
        log.info("Execute changePassword() dto {}", changePasswordDTO);
        try {
            Optional<User> optionalUser = userRepository.findById(changePasswordDTO.getUserId());
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related user is not found!");

            User user = optionalUser.get();
            if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
                throw new RayvoraException(401, "Current password is incorrect");
            }

            user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
            userRepository.save(user);

        } catch (Exception e) {
            log.error("Error in changePassword() : " + e.getMessage());
            throw e;
        }
    }
}
