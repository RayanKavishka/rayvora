package lk.ijse.rayvora.repository;

import lk.ijse.rayvora.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    Boolean existsByContact(String contact);
}
