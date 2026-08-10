package lk.ijse.rayvora.service.impl;

import lk.ijse.rayvora.dto.AddressDTO;
import lk.ijse.rayvora.entity.Address;
import lk.ijse.rayvora.entity.User;
import lk.ijse.rayvora.enumeration.Status;
import lk.ijse.rayvora.exception.RayvoraException;
import lk.ijse.rayvora.repository.AddressRepository;
import lk.ijse.rayvora.repository.UserRepository;
import lk.ijse.rayvora.service.AddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressServiceImpl implements AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public void saveAddress(AddressDTO addressDTO) {
        log.info("Execute saveAddress() dto {}", addressDTO);
        try {
            Optional<User> optionalUser = userRepository.findById(addressDTO.getUserId());
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related user is not found!");
            User user = optionalUser.get();

            Address address = new Address();
            address.setFullName(addressDTO.getFullName());
            address.setContact(addressDTO.getContact());
            address.setStreet(addressDTO.getStreet());
            address.setCity(addressDTO.getCity());
            address.setDistrict(addressDTO.getDistrict());
            address.setProvince(addressDTO.getProvince());
            address.setZipCode(addressDTO.getZipCode());
            address.setCountry(addressDTO.getCountry());

            address.setUser(user);

            addressRepository.save(address);

        } catch (Exception e) {
            log.error("Error in saveAddress() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void updateAddress(AddressDTO addressDTO) {
        log.info("Execute updateAddress() dto {}", addressDTO);
        try {
            Optional<User> optionalUser = userRepository.findById(addressDTO.getUserId());
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related user is not found!");
            User user = optionalUser.get();

            Optional<Address> optionalAddress = addressRepository.findById(addressDTO.getAddressId());
            if (optionalAddress.isEmpty())
                throw new RayvoraException(404, "Sorry, Related address is not found!");

            Address address = optionalAddress.get();
            address.setFullName(addressDTO.getFullName());
            address.setContact(addressDTO.getContact());
            address.setStreet(addressDTO.getStreet());
            address.setCity(addressDTO.getCity());
            address.setDistrict(addressDTO.getDistrict());
            address.setProvince(addressDTO.getProvince());
            address.setZipCode(addressDTO.getZipCode());
            address.setCountry(addressDTO.getCountry());

            address.setUser(user);

            addressRepository.save(address);

        } catch (Exception e) {
            log.error("Error in updateAddress() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public AddressDTO getAddressByUserId(Long userId) {
        log.info("Execute getAddressById() id {}", userId);
        try {
            Optional<AddressDTO> optionalAddress = addressRepository.getAddressByUserId(userId);
            if (optionalAddress.isEmpty())
                throw new RayvoraException(404, "Sorry, related address is not found!");

            return optionalAddress.get();

        } catch (Exception e) {
            log.error("Error in getAddressById() : " + e.getMessage());
            throw e;
        }
    }
}
