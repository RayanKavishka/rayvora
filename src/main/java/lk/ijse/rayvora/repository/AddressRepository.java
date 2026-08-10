package lk.ijse.rayvora.repository;

import lk.ijse.rayvora.dto.AddressDTO;
import lk.ijse.rayvora.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    Boolean existsByContact(String contact);

    @Query(value = """
    SELECT new lk.ijse.rayvora.dto.AddressDTO(
        a.addressId,
        a.fullName,
        a.contact,
        a.street,
        a.city,
        a.district,
        a.province,
        a.zipCode,
        a.country,
        a.user.userId
    ) 
    FROM Address a 
    WHERE a.user.userId=?1
    """)
    Optional<AddressDTO> getAddressByUserId(Long userId);
}
