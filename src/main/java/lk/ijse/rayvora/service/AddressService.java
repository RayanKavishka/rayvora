package lk.ijse.rayvora.service;

import lk.ijse.rayvora.dto.AddressDTO;

public interface AddressService {
    void saveAddress(AddressDTO addressDTO);
    void updateAddress(AddressDTO addressDTO);
    AddressDTO getAddressByUserId(Long userId);
}
